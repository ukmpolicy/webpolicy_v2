import { usePage } from '@inertiajs/react'; // Pastikan ini diimport
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner'; // 1. Impor toast

const TuiEditor = ({ initialValue = '', onChange, height = '500px' }) => {
    const editorRef = useRef();
    const [isMobile, setIsMobile] = useState(false);
    const { props } = usePage(); // Ambil semua props dari Inertia

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance.getMarkdown() !== initialValue) {
                instance.setMarkdown(initialValue);
            }
        }
    }, [initialValue]);

    const handleChange = () => {
        if (editorRef.current && onChange) {
            const markdown = editorRef.current.getInstance().getMarkdown();
            onChange(markdown);
        }
    };

    const onUploadImage = async (blob, callback) => {
        const formData = new FormData();
        formData.append('image', blob);

        // validasi ukuran file di sini
        const maxSizeInMB = 1;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (blob.size > maxSizeInBytes) {
            toast.error(`File gambar terlalu besar, tidak boleh lebih dari ${maxSizeInMB}MB.`);
            return; // Hentikan proses unggah
        }

        try {
            const csrfToken = String(props.csrf_token);
            if (!csrfToken) {
                throw new Error('CSRF token tidak tersedia.');
            }

            const response = await fetch('/articles/upload-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            // 2. Perbaiki logika untuk menangkap error dari backend
            if (!response.ok) {
                const errorData = await response.json();
                // Ambil pesan error spesifik dari validasi Laravel
                const message = errorData.errors?.image?.[0] || 'Terjadi kesalahan saat mengunggah gambar.';
                throw new Error(message);
            }

            const data = await response.json();
            callback(data.url, blob.name);
        } catch (error) {
            console.error('Error uploading image to server:', error);
            // 3. Ganti alert dengan toast.error
            toast.error(error.message);
        }
    };

    const mobileToolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol'],
        ['image', 'link'],
        ['code', 'codeblock'],
    ];

    const desktopToolbarItems = [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
    ];

    return (
        <div className="tui-editor-wrapper">
            <Editor
                ref={editorRef}
                initialValue={initialValue}
                previewStyle={isMobile ? 'tab' : 'vertical'}
                height={height}
                initialEditType={isMobile ? 'markdown' : 'wysiwyg'}
                useCommandShortcut={true}
                onChange={handleChange}
                plugins={[codeSyntaxHighlight]}
                toolbarItems={isMobile ? mobileToolbarItems : desktopToolbarItems}
                hooks={{
                    addImageBlobHook: onUploadImage,
                }}
            />
        </div>
    );
};

export default TuiEditor;
