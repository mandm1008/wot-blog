import { useRef, forwardRef, useEffect, memo } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { server } from '~/config/constants'
function TinyMCE({ children }: { children: string }, ref: any) {
  const editorRef = useRef<TinyMCEEditor>()

  useEffect(() => {
    if (ref) {
      ref.current = editorRef
    }
  }, [ref])

  return (
    <Editor
      apiKey="93bxsxzrsblrvzsbb7rpdpfg3s289ctowfp45wvyp4hi0dha"
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={children}
      init={{
        height: 500,
        width: 550,
        menubar: true,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount'
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: `
        body {
          font-family: 'Merriweather';
          font-size: 16px;
          line-height: 1;
          user-select: none;
        }

        a[href] {
          opacity: 0.8;
          transition: opacity 0.2s ease;
          text-decoration: none;
          color: #1a0dab;
          border-bottom: 2px dashed currentColor;
        }
        a[href]:hover {
          opacity: 1;
        }
    
        body > a {
          display: block;
        }
    
        img {
          max-width: 100% !important;
          object-fit: contain;
          object-position: center;
        }
    
        p {
          margin: 12px 0;
        }
    
        ul,
        ol {
          margin-left: 48px;
        }
    
        ul > *,
        ol > * {
          margin: 12px 0;
          word-wrap: break-word;
        }

        table {
          max-width: 100%;
        }

        table * {
          word-wrap: break-word;
        }
        `,
        font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        document_base_url: server
      }}
    />
  )
}

export default memo(forwardRef(TinyMCE))
