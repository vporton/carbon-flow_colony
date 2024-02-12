'use client'

import config from "@/../config.json";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function AutocompleteOrganization(props: {onRefreshUserOrganizations?: () => void}) {
    const [autocompleteOptions, setAutocompleteOptions] = useState<{id: number, name: string}[]>([]);
    const [orgToJoin, setOrgToJoin] = useState<number | undefined>(undefined);

    function onAutocompleteInputChange(event: any, value: string, reason: any) {
        fetch(config.BACKEND + `/organization/search`,
        {
            body: JSON.stringify({max: 15, prefix: `${encodeURIComponent(value)}`})
        }).then(async (res) => {
            setAutocompleteOptions(await res.json());
        });
    }

    function joinOrganization(organizationId: number) {
        fetch(config.BACKEND + "/api/organization/join", {
            method: "POST",
            cache: "no-cache",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({organizationId}),
        })
            .then(response => {
                if (response.status === 200) {
                    if (props.onRefreshUserOrganizations !== undefined) {
                        props.onRefreshUserOrganizations();
                    }
                }
            });
    }

    return (
        <>
            <Autocomplete
                id="combo-box-demo"
                options={autocompleteOptions}
                onInputChange={onAutocompleteInputChange}
                getOptionLabel={(option: {id: number, name: string}) => option.name}
                onChange={(event, value) => setOrgToJoin(value?.id)}
                renderInput={(params) => (
                    <TextField {...params} label="Organizations" variant="outlined" />
                )}
            />
            <Button disabled={orgToJoin === undefined} onClick={() => joinOrganization(orgToJoin!)}>Join</Button>
        </>
    );
}