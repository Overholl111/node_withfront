import React from "react";

import { SideBlock } from "./SideBlock";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";


export const CommentsBlock = ({ 
  postedBy,
  text,
  avatarUrl,
  children, 
  isLoading = true }) => {
  return (
    <SideBlock>
      <List>
      {(isLoading ? [...Array(5)] :  (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      {isLoading ? (
                        <Skeleton variant="circular" width={40} height={40} />
                      ) : (
                        <Avatar alt={avatarUrl} src={`http://localhost:4444/api/tmp/${avatarUrl}`} />
                      )}
                    </ListItemAvatar>
                    {isLoading ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Skeleton variant="text" height={25} width={120} />
                        <Skeleton variant="text" height={18} width={230} />
                      </div>
                    ) : (
                        <ListItemText
                        primary={postedBy}
                        secondary={text}
                      />                     
                    )}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}
      </List>
      {children}
    </SideBlock>
  );
};
