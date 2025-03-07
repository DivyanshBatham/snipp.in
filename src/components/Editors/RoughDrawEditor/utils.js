import rough from "roughjs/bundled/rough.esm.js";
const generator = rough.generator();
const padding = 3; // added padding to the edges of the selection boundary

// root of [(x1-x2)^2 + (y1, y2)^2]
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const ELEMENTS = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  selection: "selection",
  selected: "selected",
};

export function createElement(id, element, x1, y1, x2, y2) {
  switch (element) {
    case ELEMENTS.line:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.line,
        element: generator.line(x1, y1, x2, y2, {
          roughness: 1,
          preserveVertices: true,
          seed: 2,
        }),
      };
    case ELEMENTS.rectangle:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.rectangle,
        element: generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
          roughness: 1,
          preserveVertices: true,
          seed: 2,
        }),
      };
    case ELEMENTS.selection:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.selection,
        element: generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgba(67, 137, 250, 0.25)`,
          fillStyle: "solid",
          stroke: `rgba(67, 137, 250, 0.5)`,
          strokeWidth: 2,
          seed: 2,
        }),
      };
    case ELEMENTS.selected:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.selected,
        element: generator.rectangle(x1 - 3, y1 - 3, x2 - x1 + 6, y2 - y1 + 6, {
          roughness: 0,
          preserveVertices: true,
          stroke: `rgb(23, 158, 248)`,
          strokeWidth: 2,
          seed: 2,
        }),
      };
    case ELEMENTS.ellipse:
      const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.ellipse,
        element: generator.ellipse(center.x, center.y, x2 - x1, y2 - y1, {
          roughness: 1,
          preserveVertices: true,
          seed: 2,
        }),
      };
    default:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.line,
        element: generator.line(x1, y1, x2, y2, {
          roughness: 1,
          preserveVertices: true,
          seed: 2,
        }),
      };
  }
}

export function generateSelectionBoundary(id, type, x1, y1, x2, y2) {
  switch (type) {
    case ELEMENTS.line: {

      const edges = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
      };

      const skeletonLine = {
        id,
        type: ELEMENTS.line,
        ...edges,
        element: generator.line(edges.x1, edges.y1, edges.x2, edges.y2, {
          roughness: 0,
          preserveVertices: true,
          stroke: `rgba(23, 158, 248, 0)`,
          strokeWidth: 2,
        }),
      };
      const startEdge = {
        id,
        position: "start",
        type: ELEMENTS.rectangle,
        x1: edges.x1+4,
        y1: edges.y1+4,
        x2: edges.x1-4,
        y2: edges.y1-4,
        element: generator.rectangle(edges.x1-4, edges.y1-4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };

      const endEdge = {
        id,
        position: "end",
        type: ELEMENTS.rectangle,
        x1: edges.x2+4,
        y1: edges.y2+4,
        x2: edges.x2-4,
        y2: edges.y2-4,
        element: generator.rectangle(edges.x2-4, edges.y2-4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };

      return {
        skeleton: skeletonLine,
        edges: [startEdge, endEdge],
      };
    }
    default: {
      const edges = {
        x1: Math.min(x1, x2),
        y1: Math.min(y1, y2),
        x2: Math.max(x1, x2),
        y2: Math.max(y1, y2),
      };

      const boundingRect = {
        id,
        type: ELEMENTS.rectangle,
        ...edges,
        element: generator.rectangle(
          edges.x1,
          edges.y1,
          edges.x2 - edges.x1,
          edges.y2 - edges.y1,
          {
            roughness: 0,
            preserveVertices: true,
            stroke: `rgb(23, 158, 248)`,
            strokeWidth: 2,
          }
        ),
      };

      const topLeftBox = {
        id,
        position: "tl",
        type: ELEMENTS.rectangle,
        x1: edges.x1 - 4,
        y1: edges.y1 - 4,
        x2: edges.x1 + 4,
        y2: edges.y1 + 4,
        element: generator.rectangle(edges.x1 - 4, edges.y1 - 4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };
      const topRightBox = {
        id,
        position: "tr",
        type: ELEMENTS.rectangle,
        x1: edges.x2 - 4,
        y1: edges.y1 - 4,
        x2: edges.x2 + 4,
        y2: edges.y1 + 4,
        element: generator.rectangle(edges.x2 - 4, edges.y1 - 4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };

      const bottomLeftBox = {
        id,
        position: "bl",
        type: ELEMENTS.rectangle,
        x1: edges.x1 - 4,
        y1: edges.y2 - 4,
        x2: edges.x1 + 4,
        y2: edges.y2 + 4,
        element: generator.rectangle(edges.x1 - 4, edges.y2 - 4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };

      const bottomRightBox = {
        id,
        position: "br",
        type: ELEMENTS.rectangle,
        x1: edges.x2 - 4,
        y1: edges.y2 - 4,
        x2: edges.x2 + 4,
        y2: edges.y2 + 4,
        element: generator.rectangle(edges.x2 - 4, edges.y2 - 4, 8, 8, {
          roughness: 0,
          preserveVertices: true,
          fill: `rgb(23, 158, 248)`,
          fillStyle: "solid",
          stroke: `rgb(255, 255, 255)`,
          strokeWidth: 2,
        }),
      };

      return {
        skeleton: boundingRect,
        edges: [topLeftBox, topRightBox, bottomLeftBox, bottomRightBox],
      };
    }
  }
}

export function isWithinElement(x, y, element) {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENTS.rectangle: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    case ELEMENTS.line: {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x, y };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset) < 1;
    }
    case ELEMENTS.ellipse: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      const { h, k } = { h: (minX + maxX) / 2, k: (minY + maxY) / 2 };
      const a = (maxX - minX) / 2;
      const b = (maxY - minY) / 2;
      return Math.pow(x - h, 2) / Math.pow(a, 2) +
        Math.pow(y - k, 2) / Math.pow(b, 2) <=
        1
        ? true
        : false;
    }
  }
}

export function adjustElementCoordinates(element) {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENTS.rectangle: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
    case ELEMENTS.line: {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
    case ELEMENTS.ellipse: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
  }
}

export function resizeElement(x, y, position, element) {
  const { x1, y1, x2, y2 } = element;
  switch (position) {
    case "tl":
    case "start":
      return { x1: x, y1: y, x2, y2 };
    case "tr":
      return { x1, y1: y, x2: x, y2 };
    case "bl":
      return { x1: x, y1, x2, y2: y };
    case "br":
    case "end":
      return { x1, y1, x2: x, y2: y };
    default:
      return null; //should not really get here...
  }
}

export function getCursorForPosition(position) {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
}
