function OrderTracking({ status }) {
  const steps = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED"];

  const labels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SHIPPING: "Shipping",
    COMPLETED: "Completed",
  };

  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-6 overflow-x-auto w-full">
      <div className="flex items-center min-w-[500px]">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* LINE */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 ${
                    index < currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* DOT */}
              <div
                className={`
                  relative z-10 w-8 h-8 rounded-full
                  flex items-center justify-center text-sm font-bold
                  ${
                    completed
                      ? "bg-green-500 text-white"
                      : active
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-600"
                  }
                `}
              >
                {completed ? "✓" : index + 1}
              </div>

              {/* LABEL */}
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  completed || active ? "text-black" : "text-gray-400"
                }`}
              >
                {labels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracking;
