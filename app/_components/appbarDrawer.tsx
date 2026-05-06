import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Star from '@mui/icons-material/Star';
import Settings from '@mui/icons-material/Settings';
import Mail from '@mui/icons-material/Mail';
import Link from 'next/link'

type Props = {
    open:boolean,
    toggleDrawer:(open:boolean)=>void
}

type MyMenuItem = {
    Icon? : any,
    TextForMenu : string,
    href? : string
}


const myMenuList:MyMenuItem[] = [
    {TextForMenu:"クイズを解く"},
    {Icon:Star,TextForMenu:"クイズカテゴリ一覧",href:"/categories"},
    {TextForMenu:"クイズを作成する"},
    {Icon:Star,TextForMenu:"クイズ作成",href:"/create"},
    {TextForMenu:"クイズを管理する"},
    {Icon:Star,TextForMenu:"作成したクイズ一覧",href:"/myquizzes"},
    {TextForMenu:"ユーザ設定・ユーザ削除"},
    {Icon:Settings,TextForMenu:"ユーザ設定／削除",href:"/mypage"},
    // {TextForMenu:"コンタクト"},
    // {Icon:Mail,TextForMenu:"コンタクト",href:"/contact"},
]

export default function AppbarDrawer({open,toggleDrawer}:Props) {

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={()=>{toggleDrawer(false)}}>
      <List>
        {myMenuList.map((m, index) =>  {
            let Icon = m.Icon
            return(
            Icon ? (
            <ListItem key={index} disablePadding>
                <Link href={m.href!}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Icon/>
                        </ListItemIcon>
                        <ListItemText primary={m.TextForMenu} />
                    </ListItemButton>
                    </Link>
            </ListItem>) : (
                <ListItem key={index} disablePadding>
                    <ListItemText primary={m.TextForMenu} />
            </ListItem>
            )
            )})}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={()=>{toggleDrawer(false)}}>
        {DrawerList}
      </Drawer>
    </div>
  );
}