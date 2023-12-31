import { List, ListItem } from "@mui/material";
import Link from "next/link";

export default function MyMenu(props: {}) {
    return (
        <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
            <ListItem style={{width: 'auto'}}><Link href="/login" className="nav-link">Login</Link></ListItem>
            <ListItem style={{width: 'auto'}}><Link href="/" className="nav-link">Organizations</Link></ListItem>
        </List>
    );
}