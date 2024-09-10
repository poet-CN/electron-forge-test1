import { createRoot } from 'react-dom/client';
import App from './pages/index'

const root = createRoot(document.body);
root.render(
    <div id='root'>
        <App />
    </div>
);