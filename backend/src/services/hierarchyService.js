// This is the core brain of the app. It takes a raw array of strings,
// figures out which ones are valid edges, builds the trees, detects cycles,
// and spits back everything the spec asks for.

function processData(data) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const valid_edges = [];

    // track which edges we've seen to catch duplicates
    const seen_edges = new Set();
    // once we flag an edge as duplicate we only want it in the list once
    const already_flagged_dupe = new Set();

    // child -> parent mapping; lets us check multi-parent situations quickly
    const parentOf = new Map();

    const all_nodes = new Set();
    // adjacency list: parent -> list of children
    const adj = new Map();

    // ── Step 1: walk through every input string and classify it ──────────────
    for (const raw of data) {
        // handle non-strings gracefully even though the spec says it'll be strings
        if (typeof raw !== 'string') {
            invalid_entries.push(String(raw));
            continue;
        }

        const entry = raw.trim();

        // empty or whitespace-only
        if (!entry) {
            invalid_entries.push(raw);
            continue;
        }

        const parts = entry.split('->');

        // must split into exactly two parts on "->"
        if (parts.length !== 2) {
            invalid_entries.push(entry);
            continue;
        }

        const [parent, child] = parts;

        // each side must be a single A-Z character, nothing more
        if (
            parent.length !== 1 ||
            child.length !== 1 ||
            !/^[A-Z]$/.test(parent) ||
            !/^[A-Z]$/.test(child)
        ) {
            invalid_entries.push(entry);
            continue;
        }

        // self-loops like "A->A" are invalid per the spec
        if (parent === child) {
            invalid_entries.push(entry);
            continue;
        }

        const edgeKey = `${parent}->${child}`;

        if (seen_edges.has(edgeKey)) {
            // spec says: if the same edge shows up multiple times, add it to
            // duplicate_edges exactly once regardless of how many times it repeats
            if (!already_flagged_dupe.has(edgeKey)) {
                already_flagged_dupe.add(edgeKey);
                duplicate_edges.push(edgeKey);
            }
            continue;
        }

        // first time seeing this edge
        seen_edges.add(edgeKey);

        // diamond/multi-parent case: if the child already has a parent, ignore this edge silently
        if (parentOf.has(child)) {
            continue;
        }

        parentOf.set(child, parent);
        valid_edges.push({ parent, child });
        all_nodes.add(parent);
        all_nodes.add(child);

        if (!adj.has(parent)) adj.set(parent, []);
        adj.get(parent).push(child);
    }

    // ── Step 2: group nodes into connected components using union-find ───────
    // using path compression but not rank since our trees are small anyway
    const uf = new Map();

    const find = (x) => {
        if (!uf.has(x)) uf.set(x, x);
        if (uf.get(x) !== x) uf.set(x, find(uf.get(x)));
        return uf.get(x);
    };

    const unite = (x, y) => {
        const rx = find(x);
        const ry = find(y);
        if (rx !== ry) uf.set(rx, ry);
    };

    for (const { parent, child } of valid_edges) {
        unite(parent, child);
    }

    // collect each component's nodes
    const components = new Map();
    for (const node of all_nodes) {
        const compId = find(node);
        if (!components.has(compId)) components.set(compId, new Set());
        components.get(compId).add(node);
    }

    // ── Step 3: process each component → tree or cycle ───────────────────────
    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let deepest = 0;
    let deepest_root = null;

    for (const nodes of components.values()) {
        // a root is a node that has no parent within the valid edges
        const roots = [...nodes].filter(n => !parentOf.has(n));

        let treeRoot;
        let isCycle = false;

        if (roots.length === 0) {
            // every node in this component is someone's child → pure cycle
            // the spec says use the lexicographically smallest node as the root label
            treeRoot = [...nodes].sort()[0];
            isCycle = true;
        } else {
            // with max in-degree of 1 and no cycle, there's always exactly one root
            treeRoot = roots[0];
        }

        if (isCycle) {
            total_cycles++;
            hierarchies.push({ root: treeRoot, tree: {}, has_cycle: true });
            continue;
        }

        // build the nested object representation of this tree
        const buildTree = (node) => {
            const obj = {};
            // sort children alphabetically for consistent output
            const kids = (adj.get(node) || []).slice().sort();
            for (const kid of kids) {
                obj[kid] = buildTree(kid);
            }
            return obj;
        };

        // depth = number of nodes on the longest root-to-leaf path
        const getDepth = (node) => {
            const kids = adj.get(node) || [];
            if (kids.length === 0) return 1;
            return 1 + Math.max(...kids.map(getDepth));
        };

        const treeObj = { [treeRoot]: buildTree(treeRoot) };
        const depth = getDepth(treeRoot);
        total_trees++;

        // keep track of which tree is the deepest (lex smaller root breaks ties)
        if (depth > deepest || (depth === deepest && deepest_root && treeRoot < deepest_root)) {
            deepest = depth;
            deepest_root = treeRoot;
        }

        hierarchies.push({ root: treeRoot, tree: treeObj, depth });
    }

    // sort hierarchies: non-cyclic trees first, then cycles; alphabetical by root within each group
    hierarchies.sort((a, b) => {
        if (a.has_cycle && !b.has_cycle) return 1;
        if (!a.has_cycle && b.has_cycle) return -1;
        return a.root < b.root ? -1 : a.root > b.root ? 1 : 0;
    });

    return {
        user_id: "kadapalavenkatanikithreddy_11012006",
        email_id: "kv9529@srmist.edu.in",
        college_roll_number: "RA2311003010214",
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root: deepest_root || "",
        },
    };
}

module.exports = { processData };
