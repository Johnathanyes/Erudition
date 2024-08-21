import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingButton = ({
    isLoading,
    children,
    loadingText
} : {
    isLoading: boolean,
    children: React.ReactNode,
    loadingText: string
}) => {
  return (
    <Button
          type="submit"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isLoading ? loadingText : children}
    </Button>
  )
}

export default LoadingButton
