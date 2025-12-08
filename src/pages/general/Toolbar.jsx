import { useEffect } from 'react';
import AbstractButton from './toolbar_buttons/AbstractButton';

export default function Toolbar({ buttons, context }) {
  return (
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-4">
        {buttons.map(button => (
          <AbstractButton
            key={button.key}
            button={button}
            context={context}
          />
        ))}
      </div>
  );
}
