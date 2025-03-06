export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-10 h-10"
      >
        <style>
          {`
          .spinner {
            fill: none;
            stroke-width: 6;
            stroke-linecap: round;
            transform-origin: center;
            animation: rotate 1.4s linear infinite;
          }
          
          .spinner-track {
            stroke: #333333;
          }
          
          .spinner-head {
            stroke: #e0e0e0;
            stroke-dasharray: 60, 150;
          }
          
          @keyframes rotate {
            100% {
              transform: rotate(360deg);
            }
          }
          `}
        </style>

        <g className="spinner">
          <circle className="spinner-track" cx="50" cy="50" r="40" />
          <circle className="spinner-head" cx="50" cy="50" r="40" />
        </g>
      </svg>
    </div>
  );
}
