function processData(data) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const valid_edges = [];
    const seen_edges = new Set();
    const parentOf = new Map(); // child -> parent

    const all_nodes = new Set();
    const adj = new Map(); // parent -> [children]

    // 1. Validation and Duplicates
    for (let rawStr of data) {
        if (typeof rawStr !== 'string') {
            invalid_entries.push(String(rawStr));
            continue;
        }
        const str = rawStr.trim();
        if (!str) {
            invalid_entries.push(rawStr);
            continue;
        }

        const parts = str.split('->');
        if (parts.length !== 2) {
            invalid_entries.push(rawStr);
            continue;
        }

        const [u, v] = parts;
        if (u.length !== 1 || v.length !== 1 || !/[A-Z]/.test(u) || !/[A-Z]/.test(v)) {
            invalid_entries.push(rawStr);
            continue;
        }

        if (u === v) {
            invalid_entries.push(rawStr);
            continue;
        }

        const edgeKey = `${u}->${v}`;
        if (seen_edges.has(edgeKey)) {
            duplicate_edges.push(rawStr);
        } else {
            seen_edges.add(edgeKey);
            // Multi-parent check
            if (!parentOf.has(v)) {
                parentOf.set(v, u);
                valid_edges.push({ u, v });
                all_nodes.add(u);
                all_nodes.add(v);
                
                if (!adj.has(u)) adj.set(u, []);
                adj.get(u).push(v);
            }
        }
    }

    // 2. Connected Components
    const uf = new Map();
    const getRoot = (x) => {
        if (!uf.has(x)) uf.set(x, x);
        if (uf.get(x) !== x) uf.set(x, getRoot(uf.get(x)));
        return uf.get(x);
    };
    const union = (x, y) => {
        const rootX = getRoot(x);
        const rootY = getRoot(y);
        if (rootX !== rootY) uf.set(rootX, rootY);
    };

    for (let {u, v} of valid_edges) {
        union(u, v);
    }

    const groups = new Map(); // root -> set of nodes
    for (let node of all_nodes) {
        const root = getRoot(node);
        if (!groups.has(root)) groups.set(root, new Set());
        groups.get(root).add(node);
    }

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_depth = 0;
    let largest_tree_root = null; // or empty string? we will see

    for (let [comp_root, group_nodes] of groups.entries()) {
        let possible_roots = [];
        for (let node of group_nodes) {
            if (!parentOf.has(node)) {
                possible_roots.push(node);
            }
        }

        let root_for_hierarchy;
        let has_cycle = false;

        if (possible_roots.length === 0) {
            // pure cycle
            let min_node = null;
            for (let node of group_nodes) {
                if (min_node === null || node < min_node) min_node = node;
            }
            root_for_hierarchy = min_node;
            has_cycle = true;
        } else {
            // Since max in-degree is 1, a weakly connected component without a cycle
            // must be a tree and therefore has exactly 1 root.
            root_for_hierarchy = possible_roots[0]; 
        }

        let tree_obj = {};
        let depth = 0;

        if (has_cycle) {
            total_cycles++;
        } else {
            const buildTree = (node) => {
                const nodeObj = {};
                const children = adj.get(node) || [];
                children.sort(); // Lexicographical sort for consistency
                for (let child of children) {
                    nodeObj[child] = buildTree(child);
                }
                return nodeObj;
            };

            const getDepth = (node) => {
                const children = adj.get(node) || [];
                if (children.length === 0) return 1;
                let maxChildDepth = 0;
                for (let child of children) {
                    maxChildDepth = Math.max(maxChildDepth, getDepth(child));
                }
                return 1 + maxChildDepth;
            };

            tree_obj[root_for_hierarchy] = buildTree(root_for_hierarchy);
            depth = getDepth(root_for_hierarchy);
            total_trees++;

            if (depth > largest_tree_depth) {
                largest_tree_depth = depth;
                largest_tree_root = root_for_hierarchy;
            } else if (depth === largest_tree_depth && largest_tree_root !== null) {
                if (root_for_hierarchy < largest_tree_root) {
                    largest_tree_root = root_for_hierarchy;
                }
            }
        }

        const hierarchy = {
            root: root_for_hierarchy,
            tree: has_cycle ? {} : tree_obj,
        };

        if (has_cycle) {
            hierarchy.has_cycle = true;
        } else {
            hierarchy.depth = depth;
        }

        hierarchies.push(hierarchy);
    }
    
    // As per the example, if no largest_tree_root is found, it might need to be omitted or null.
    // The example says "largest_tree_root": "A"

    return {
        user_id: "kadap_24042026", // Update with user credentials if needed
        email_id: "kadap@college.edu",
        college_roll_number: "24CS1001",
        hierarchies: hierarchies,
        invalid_entries: invalid_entries,
        duplicate_edges: duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            ...(largest_tree_root ? { largest_tree_root } : { largest_tree_root: "" })
        }
    };
}

module.exports = {
    processData
};
