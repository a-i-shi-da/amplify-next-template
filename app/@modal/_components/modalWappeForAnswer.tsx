'use client'

import BasicModal from "@/app/_components/modalComponent"
import { ReactNode,useEffect,useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
    children:ReactNode
}

export function ModalWrapperForAnswer({children}:Props){

    const router = useRouter()
    const [open,setOpen] = useState<boolean>(false)
    const handleClose = () => {
        setOpen(false)
        router.back()
    }

    useEffect(()=>{
        setOpen(true)
    },[])

    return (
        <BasicModal open={open} handleClose={handleClose}>
            {children}
        </BasicModal>
    )
}