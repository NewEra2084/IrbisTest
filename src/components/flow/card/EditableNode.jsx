import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { EditText } from 'react-edit-text';

import EditableDropdownButton from '@/components/flow/card/EditableDropdownButton';

import 'react-edit-text/dist/index.css';
import '@/css/card.css';

export function EditableNode({ id, data }) {
  const typeItems = [
                         {id:1,name:"back"},
                         {id:2,name:"front"},
          ];

  const handleSave = ({ value }) => {
    data.onChange?.(id, value);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} id="a" />
      <div className="relative bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="relative px-2 py-1">
          <div className="absolute left-2 top-1 text-left">
            {/* Left side — можно вставить dropdown */}
            <EditableDropdownButton items={typeItems}/>
          </div>
          <div className="absolute right-2 top-0 text-right">
            {/* Right side — кнопка закрытия */}
            <button
              className="text-red-500 hover:text-red-700 text-base"
              onClick={() => data.onDelete?.(id)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 mb-5 px-4">
          <EditText
            onSave={handleSave}
            defaultValue={data.label || ''}
            placeholder="Node name"
            className="w-full text-center bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none text-base font-medium dark:text-white"
          />
        </div>

        {/* Footer (пока пустой, но можно расширить) */}
        <div className="px-2 py-1 border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      <Handle type="source" position={Position.Bottom} id="b" />
    </>
  );
}

export default memo(EditableNode);
