import React, { useEffect, useState } from 'react';
import { Flex, Box, Image } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { handleGetProfile } from '../utils/3box';
import { truncateAddr } from '../utils/general';

const HubProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const { address } = useInjectedProvider();

  useEffect(() => {
    const getProfile = async () => {
      if (address) {
        try {
          const data = await handleGetProfile(address);
          if (data.status === 'error') {
            return;
          }
          setProfile(data);
        } catch (error) {
          console.log("address doesn't have a profile");
        }
      }
    };

    getProfile();
  }, [address]);

  return (
    <>
      {address ? (
        <>
          <Flex direction='row' alignItems='center' pt={2}>
            {profile?.image && profile.image[0] ? (
              <Image
                w='100px'
                h='100px'
                mr={6}
                rounded='full'
                src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
              />
            ) : (
              <Image
                w='100px'
                h='100px'
                mr={6}
                rounded='full'
                src={makeBlockie(address)}
              />
            )}

            <Flex direction='column'>
              <Box fontSize='xl' fontFamily='heading'>
                {profile?.name || truncateAddr(address)}{' '}
                <span>{profile?.emoji || ''} </span>
              </Box>
            </Flex>
          </Flex>
          <Box fontSize='sm' mt={4} fontFamily='mono'>
            {profile?.description}
          </Box>
        </>
      ) : null}
    </>
  );
};

export default HubProfileCard;
