import React from 'react'
import { SubmitButton } from '@/components/dashboard/SubmitButton';
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

async function page({ params }: { params: Promise<{ siteId: string }> }) {
  const resolvedParams = await params;
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button variant="outline" size="icon">
          <Link href={`/sites/${resolvedParams.siteId}`}>
            <ChevronLeft className='size-4' />
          </Link>
        </Button>
        <h3 className='text-xl font-semibold'>Go back</h3>
      </div>

      <Card className='border-red-500 bg-red-500/10'>
        <CardHeader>
          <CardTitle className='text-red-500'>Danger</CardTitle>
          <CardDescription>
            This will delete your site and all articles associted with it.
            Click the button below to delete everything.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <SubmitButton text='Delete Everything' variant="destructive"/>
        </CardFooter>
      </Card>
    </>
  )
}

export default page