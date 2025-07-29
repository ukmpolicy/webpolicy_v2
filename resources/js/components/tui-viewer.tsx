import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'; // TETAPKAN BARIS INI
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import 'prismjs/themes/prism-tomorrow.css'; // Tema gelap PrismJS untuk blok kode
import 'prismjs/themes/prism.css'; // Tema terang PrismJS (akan ditimpa oleh prism-tomorrow di dark mode)

interface TuiViewerProps {
    content?: string;
}

const TuiViewer = ({ content }: TuiViewerProps) => {
    return (
        <div className="tui-viewer-wrapper">
            {' '}
            {/* Tambahkan wrapper untuk kontrol tema */}
            <Viewer
                initialValue={content || ''}
                plugins={[codeSyntaxHighlight]}
                // Kelas `prose` akan dihandle di level parent komponen (ArticleShow)
                // Hapus `className="prose max-w-none"` dari sini
            />
        </div>
    );
};

export default TuiViewer;
