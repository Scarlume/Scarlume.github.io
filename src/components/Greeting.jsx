import { useState } from 'preact/hooks';

export default function Greeting({ messages }) {
  const randomMessage = () => messages[Math.floor(Math.random() * messages.length)];

  const [greeting, setGreeting] = useState(messages[0]);

  return (
    <div className="greeting-container">
      <h3 className="greeting-text">{greeting}！感谢来访！</h3>
      <button className="greeting-button" onClick={() => setGreeting(randomMessage())}>
        新的欢迎语
      </button>

      <style jsx>{`
        .greeting-container {
          text-align: center;
          margin: 2rem 0;
        }

        .greeting-text {
          color: #4f46e5;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .greeting-button {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .greeting-button:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .greeting-button:active {
          transform: translateY(0);
        }

        @media (prefers-color-scheme: dark) {
          .greeting-text {
            color: #6366f1;
          }

          .greeting-button {
            background: #6366f1;
          }

          .greeting-button:hover {
            background: #5b21b6;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
