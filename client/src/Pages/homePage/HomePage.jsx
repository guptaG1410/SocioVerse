import React from 'react';
import Navbar from 'Pages/navbar/Navbar';
import { Box, useMediaQuery } from '@mui/material';
import UserWidget from 'Pages/widgets/UserWidget';
import { useSelector } from 'react-redux';
import MyPostWidget from 'Pages/widgets/MyPostWidget';
import PostsWidget from 'Pages/widgets/PostsWidget';
import FriendListWidget from 'Pages/widgets/FriendListWidget';
import AdWidget from 'Pages/widgets/AdWidget';

function HomePage() {
  const isNonMobileScreen = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? 'flex' : 'block'}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreen ? '42%' : undefined}
          mt={isNonMobileScreen ? undefined : '2rem'}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreen && (
        <Box flexBasis="26%">
          <AdWidget />
          <Box m = "2rem 0" />
          <FriendListWidget userId={_id} />
        </Box>
        )}
      </Box>
    </Box>
  );
}

export default HomePage;
