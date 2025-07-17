import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'; // Opsional, jika Anda memiliki mode gelap
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';

interface TuiViewerProps {
    content?: string;
}

const TuiViewer = ({ content }: TuiViewerProps) => {
    return (
        <Viewer
            initialValue={content || ''}
            plugins={[codeSyntaxHighlight]} // Pastikan plugin yang sama digunakan jika perlu di viewer
            className="prose dark:prose-invert max-w-none" // Tailwind Prose untuk styling dasar
        />
    );
};

export default TuiViewer;
