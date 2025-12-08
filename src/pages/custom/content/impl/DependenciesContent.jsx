import React, { useCallback, useRef} from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Controls,
  Background,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';

import ButtonEdge from '@/components/flow/card/ButtonEdge';
import EditableNode from '@/components/flow/card/EditableNode';

import 'reactflow/dist/style.css';
import '@/css/index.scss';
import 'font-awesome/css/font-awesome.min.css';
//import "bootstrap-icons/font/bootstrap-icons.css";


const edgeTypes = {
  default: ButtonEdge,
};

const nodeTypes = { default: EditableNode };

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  const onChange = function (id,label){
        setNodes((nds) =>
                nds.map((node) => {
                  if (node.id !== id) {
                    return node;
                  }

                  return {
                    ...node,
                    data: {
                      ...node.data,
                      label:label,
                    },
                  };
                })
              );
  }


  const initialNodes = [
    {
      id: '0',
      type: 'default',
      data: {onChange : onChange, label: 'Node' },
      position: { x: 0, y: 50 },
    },
  ];


  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback(
    (params) => {
      // reset the start node on connections
      connectingNodeId.current = null;
      console.log(params);
      setEdges((eds) => addEdge(params, eds))
    },
    [],
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: {onChange: onChange, label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  return (
    <div className="relative w-full h-full flex-1" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
        minZoom={0.2}
        maxZoom={4}
        attributionPosition="hidden"
        className="w-full h-full"
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

    </div>
  );
};

export default function DependenciesContent({data}) {
    /*return (<div>Тут другой контент</div>);*/
    return (
             <ReactFlowProvider>
               <AddNodeOnEdgeDrop />
             </ReactFlowProvider>
    );
}