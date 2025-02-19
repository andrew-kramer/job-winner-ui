import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccountCircle from '@mui/icons-material/AccountCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Brightness4, Brightness7 } from "@mui/icons-material";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Tooltip } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_PROFILE, GET_ALL_OFFERS, GET_ALL_INTERVIEWS } from '../graphql/query';
import SearchBar from './SearchBar';
import InterviewListDialog from './InterviewListDialog';
import JobApplicationDialog from './JobApplicationDialog';
import OfferListDialog from './OfferListDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useDialog from '../hooks/useDialog';
import ProfileDialog from './ProfileDialog';
import JobApplicationList from './JobApplicationList';
import MobileMenu from './MobileMenu';
import { getFilteredInterviews } from '../utils/interviewUtil';
import FrequentUrlDialog from './FrequentUrlDialog';
import QuestionDialog from './QuestionDialog';
import { useColorMode } from "./ThemeContext";

export default function AppHeader() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { mode, toggleColorMode } = useColorMode();

  const { data: offersData, loading: offersLoading, error: offersError, refetch: refetchOffers } = useQuery(GET_ALL_OFFERS, {
    fetchPolicy: 'network-only',
  });
  const { data: interviewsData, loading: interviewsLoading, error: interviewsError, refetch: refetchInterviews } = useQuery(GET_ALL_INTERVIEWS, {
    fetchPolicy: 'network-only',
  });
  const { open, handleOpen, handleClose } = useJobApplicationDialog(refetchOffers);

  const {
    dialogOpen: offerListingDialogOpen,
    handleOpen: handleOfferListDialogOpen,
    handleClose: handleOfferListDialogClose,
  } = useDialog(refetchOffers);

  const {
    dialogOpen: interviewListingDialogOpen,
    handleOpen: handleInterviewListDialogOpen,
    handleClose: handleInterviewListDialogClose,
  } = useDialog(refetchInterviews);

  const {
    dialogOpen: frequentUrlsDialogOpen,
    handleOpen: handleFrequentUrlsDialogOpen,
    handleClose: handleFrequentUrlsDialogClose,
  } = useDialog();

  const {
    dialogOpen: questionDialogOpen,
    handleOpen: handleQuestionDialogOpen,
    handleClose: handleQuestionDialogClose,
  } = useDialog();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const id = 1;

  const { error, data, loading } = useQuery(GET_PROFILE, {
    variables: { id },
  });

  const offerCount = offersData?.allOffer?.length || 0;

  const filteredInterviews = getFilteredInterviews(interviewsData?.allInterview);
  
  const interviewCount = filteredInterviews?.length || 0;

  const handleProfileMenuOpen = () => {
    setProfileOpen(true);
    setProfile(data.profileById);
  };

  const handleProfileClose = () => setProfileOpen(false);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <JobApplicationDialog
        jobApplication={{ status: 'open' }}
        open={open}
        handleClose={handleClose}
        setOpen={handleOpen}
        isNew
      />
      <FrequentUrlDialog
        open={frequentUrlsDialogOpen}
        handleClose={handleFrequentUrlsDialogClose}
        setOpen={handleFrequentUrlsDialogOpen}
      />
      <QuestionDialog
        open={questionDialogOpen}
        handleClose={handleQuestionDialogClose}
        setOpen={handleQuestionDialogOpen}
      />
      <ProfileDialog
        profile={profile}
        open={profileOpen}
        handleClose={handleProfileClose}
        setOpen={setProfileOpen}
      />
      <InterviewListDialog
        open={interviewListingDialogOpen}
        handleClose={handleInterviewListDialogClose}
        setOpen={handleInterviewListDialogOpen}
      />
      <OfferListDialog
        open={offerListingDialogOpen}
        handleClose={handleOfferListDialogClose}
        setOpen={handleOfferListDialogOpen}
      />
      <AppBar position="static">
        <Toolbar>
        <EmojiEventsIcon sx={{ color: '#FFD700', mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JOB WINNER
          </Typography>
          <SearchBar onSearch={handleSearch} />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="New Job Application">
              <IconButton size="large" aria-label="New" color="inherit" onClick={handleOpen}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bookmarks">
              <IconButton size="large" aria-label="New" color="inherit" onClick={handleFrequentUrlsDialogOpen}>
                <BookmarksIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Q&A">
              <IconButton size="large" aria-label="New" color="inherit" onClick={handleQuestionDialogOpen}>
                <QuestionAnswerIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Interview List">
              <IconButton size="large" color="inherit" onClick={handleInterviewListDialogOpen}>
                <Badge badgeContent={interviewsLoading ? '...' : interviewCount} color="error">
                  <EventAvailableIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Offer List">
              <IconButton size="large" color="inherit" onClick={handleOfferListDialogOpen}>
                <Badge badgeContent={offersLoading ? '...' : offerCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={(mode === "dark" ? 'Light' : 'Dark') + ' Mode'}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Profile">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={(event) => setMobileMoreAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <MobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          handleMobileMenuClose={handleMobileMenuClose}
          handleProfileMenuOpen={handleProfileMenuOpen} 
          handleJobApplicationOpen={handleOpen}
          handleFrequentUrlsDialogOpen={handleFrequentUrlsDialogOpen}
          handleQuestionDialogOpen={handleQuestionDialogOpen}
          handleInterviewListDialogOpen={handleInterviewListDialogOpen}
          handleOfferListDialogOpen={handleOfferListDialogOpen}
          interviewCount={interviewCount}
          offerCount={offerCount}
          colorMode={mode}
          toggleColorMode={toggleColorMode}
        />
      </AppBar>
      <JobApplicationList searchTerm={searchTerm} />
    </Box>
  );
}
