import { type JSONContent } from 'novel'
import React, { useMemo } from 'react'
import { generateHTML } from "@tiptap/html"
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Text from '@tiptap/extension-text'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Code from '@tiptap/extension-code'
import TextSyle from '@tiptap/extension-text-style'
import CodeBlock from '@tiptap/extension-code-block'
import BlockQuote from '@tiptap/extension-blockquote'

function RenderArticle({ json }: { json: JSONContent }) {
  const outPut = useMemo(() => {
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Link,
      Underline,
      Heading,
      ListItem,
      BulletList,
      OrderedList,
      Code,
      CodeBlock,
      TextSyle,
      BlockQuote,
    ])
  }, [json])
  return (
    <>
      <div className='prose m-auto w-11/12 sm:prose-lg dark:prose-invert sm:w-2/3 prose-li:marker:text-primary'
        dangerouslySetInnerHTML={{ __html: outPut }}
      />
    </>
  )
}

export default RenderArticle