import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SimpleCard({selected, buttons, children}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl shadow text-sm flex flex-col md:flex-row">

        {/* Абсолютно позиционируем кнопки */}
        {buttons && (
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition z-10"
                title={button.title}
                onClick={button.onClick}
              >
                {button.prefix && <span>{button.prefix} </span>}
                <FontAwesomeIcon icon={button.icon} className="w-4 h-4" />
                {button.suffix && <span> {button.suffix}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Контент */}
        <div className="p-2 w-full">
          {children}
        </div>
    </div>
  );
}
