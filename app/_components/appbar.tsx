'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { getCurrentUser, signOut } from '@aws-amplify/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hub } from 'aws-amplify/utils'
import AppbarDrawer from './appbarDrawer'

export function MyAppBar() {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  //ドロワー用
  const [open,setOpen] = useState<boolean>(false)
  const handleClose = () => {setOpen(false)}
  const openDrawer = () => {setOpen(true)}

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        setIsLogin(!!user)
      } catch {
        setIsLogin(false)
      }
    }

    checkUser()

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') setIsLogin(true)
      if (payload.event === 'signedOut') setIsLogin(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut()
    setIsLogin(false)
    router.push('/login')
  }

  return (
    <div>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={openDrawer}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                <Link href="/">クイズ作成アプリ</Link>
            </Typography>

            {isLogin ? (
                <Button color="inherit" onClick={logout}>
                Logout
                </Button>
            ) : (
                <Link href="/login">
                <Button color="inherit">Login</Button>
                </Link>
            )}
            </Toolbar>
        </AppBar>
        </Box>
        <AppbarDrawer open={open} toggleDrawer={handleClose}></AppbarDrawer>
    </div>
  )
}