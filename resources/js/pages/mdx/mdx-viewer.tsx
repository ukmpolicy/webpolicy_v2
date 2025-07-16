import { compile, run } from '@mdx-js/mdx'; // Import compile dan run
import { MDXProvider } from '@mdx-js/react';
import React from 'react';
import * as runtime from 'react/jsx-runtime'; // Import runtime React

// Contoh komponen kustom yang bisa Anda gunakan dalam MDX Anda
const components = {
    h1: (props) => <h1 className="mb-4 text-3xl font-bold" {...props} />,
    h2: (props) => <h2 className="mt-6 mb-3 text-2xl font-semibold" {...props} />,
    p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: (props) => <ul className="mb-4 list-disc pl-5" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal pl-5" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
    img: (props) => <img className="my-4 h-auto max-w-full rounded-lg shadow-md" {...props} />,
    // Tambahkan komponen kustom lainnya jika Anda punya
    // Misalnya: <Button variant="primary">Klik Saya</Button>
    // Button: (props) => <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" {...props} />,
};

export function MDXViewer({ content }) {
    const [mdxContent, setMdxContent] = React.useState(null);

    React.useEffect(() => {
        async function loadMDX() {
            if (!content) {
                setMdxContent(null);
                return;
            }
            try {
                // Kompilasi MDX string ke JSX
                const code = String(
                    await compile(content, {
                        outputFormat: 'function-body',
                    }),
                );

                // Jalankan JSX yang sudah dikompilasi
                // `run` membutuhkan `react/jsx-runtime` dan komponen Anda
                const { default: Content } = await run(code, {
                    ...runtime,
                    baseUrl: import.meta.url, // Penting untuk resolve path di produksi
                });

                setMdxContent(<Content />);
            } catch (error) {
                console.error('Error compiling/rendering MDX:', error);
                setMdxContent(<p className="text-red-500">Error rendering article content.</p>);
            }
        }

        loadMDX();
    }, [content]);

    return (
        <div className="prose dark:prose-invert max-w-none">
            <MDXProvider components={components}>{mdxContent}</MDXProvider>
        </div>
    );
}
