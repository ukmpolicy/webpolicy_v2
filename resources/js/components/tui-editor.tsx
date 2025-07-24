import { usePage } from '@inertiajs/react';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'; // TETAPKAN BARIS INI
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const TuiEditor = ({ initialValue = '', onChange, height = '500px' }) => {
    const editorRef = useRef(null); // Tipe ref bisa lebih spesifik jika Anda menggunakan TypeScript
    const [isMobile, setIsMobile] = useState(false);
    const { props } = usePage();
    // Mendeteksi mode tema dari elemen html. Ini mengasumsikan Anda memiliki mekanisme untuk menambah/menghapus kelas 'dark' di <html>
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Listener untuk perubahan tema (jika Anda memiliki toggle tema)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(document.documentElement.classList.contains('dark'));
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance && instance.getMarkdown() !== initialValue) {
                instance.setMarkdown(initialValue);
            }
        }
    }, [initialValue]);

    const handleChange = () => {
        if (editorRef.current) {
            const instance = editorRef.current.getInstance();
            if (instance && onChange) {
                const markdown = instance.getMarkdown();
                onChange(markdown);
            }
        }
    };

    const onUploadImage = async (blob, callback) => {
        // Perbaiki tipe jika menggunakan TypeScript
        const formData = new FormData();
        formData.append('image', blob);

        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (blob.size > maxSizeInBytes) {
            toast.error(`File gambar terlalu besar, tidak boleh lebih dari ${maxSizeInMB}MB.`);
            return;
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

            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.errors?.image?.[0] || 'Terjadi kesalahan saat mengunggah gambar.';
                throw new Error(message);
            }

            const data = await response.json();
            callback(data.url, blob.name);
        } catch (error) {
            // Perbaiki tipe jika menggunakan TypeScript
            console.error('Error uploading image to server:', error);
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
        <div className={`tui-editor-wrapper ${isDarkMode ? 'toastui-editor-dark' : ''}`}>
            {' '}
            {/* Tambahkan kelas tema gelap secara kondisional */}
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
