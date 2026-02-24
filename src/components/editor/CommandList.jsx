import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";

const CommandList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!props.items.length) return false;

      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length,
        );
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  return (
    <div className="bg-white border rounded-lg shadow-xl min-w-[180px] z-[9999]">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            key={index}
            className={`block w-full px-3 py-2 text-left text-sm ${
              index === selectedIndex
                ? "bg-orange-50 text-orange-600 font-medium"
                : "hover:bg-gray-100"
            }`}
            onClick={() => selectItem(index)}
          >
            {item.title}
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-sm text-gray-400 italic">
          Nenhum comando encontrado...
        </div>
      )}
    </div>
  );
});

export default CommandList;
