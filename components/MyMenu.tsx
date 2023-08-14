import { List, ListItem } from "@mui/material";
import Link from "next/link";

export default function MyMenu(props: {}) {
    return (
        <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
            {/* TODO: Clicking outside item does not open the link. */}
            <ListItem><Link href="/login" className="nav-link">Login</Link></ListItem>
            <ListItem><Link href="/" className="nav-link">Organizations</Link></ListItem>
        </List>
    );
}