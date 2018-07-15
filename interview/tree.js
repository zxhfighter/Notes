// 深度优先遍历的递归写法-使用 children
function deepTraverse(node, visit) {
    visit(node);

    for (const child of node.children) {
        deepTraverse(child, visit);
    }
}

// 深度优先遍历的递归写法-使用 firstElementChild 和 nextElementSibling
function deepTraverse2(node, visit) {
    visit(node);

    let child = node.firstElementChild;
    while (child) {
        deepTraverse2(child, visit);
        child = child.nextElementSibling;
    }
}

function deepTraverse3(node, visit) {

    const stack = [node];
    while (stack.length) {
        const latest = stack.pop();
        visit(latest);

        Array.from(latest.children || []).reverse().forEach(x => stack.push(x));
    }
}

function broadTraverse(node, visit) {

    const queue = [node];
    while (queue.length) {
        const node = queue.shift();
        visit(node);

        if (!node.children.length) {
            continue;
        }

        Array.from(node.children).forEach(x => queue.push(x));
    }
}

window.onload = function () {
    const rootNode = document.querySelector('.rootNode');
    // deepTraverse(rootNode, node => {
    //     console.log(node.getAttribute('id'));
    // });
    deepTraverse3(rootNode, node => {
        console.log(node && node.getAttribute('id'));
    })
}
