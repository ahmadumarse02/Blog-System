import { DeleteArticleAction } from '@/actions/deleteArticleAction'
import { SubmitButton } from '@/components/dashboard/submitButton'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

function DeletePage({params}: {params: {siteId: string, articleId: string}}) {
  return (
   <div className="flex flex-1 items-center justify-center">
    <Card className='max-w-xl'>
        <CardHeader>
            <CardTitle>
                Are You absolutely sure?
            </CardTitle>
            <CardDescription>
                This action cannot be undone. This will permanently delete your article and remove it from our servers.
            </CardDescription>
        </CardHeader>
        <CardFooter className='w-full flex justify-between'>
            <Button variant="secondary" asChild>
                <Link href={`/sites/${params.siteId}`}>Cancel</Link>
            </Button>
           <form action={DeleteArticleAction}>
            <input type="hidden" name='articleId' value={params.articleId} />
            <input type="hidden" name='siteId' value={params.siteId} />
            <SubmitButton variant="destructive" text='Delete Article'/>
           </form>
        </CardFooter>
    </Card>
   </div>
  )
}

export default DeletePage