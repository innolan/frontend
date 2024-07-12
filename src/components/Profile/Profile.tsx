"use client"

import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../Styles/Profile/profile.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ProfileInfo from "@/components/UniversalComponents/ProfileInfo/ProfileInfo";
import ProfileHeader from "@/components/UniversalComponents/ProfileHeader/ProfileHeader";
import {RootState} from "@/Store/store";
import {useSelector} from "react-redux";
import { useGetUserInfoQuery } from '@/Store/api/profileApi';

const Profile: FC = () => {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const profile = useSelector((state: RootState) => state.profile);
  const birthday = useSelector((state: RootState) => state.birthday);
  const { data: userInfo, refetch } = useGetUserInfoQuery({});
  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    refetch();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [refetch]);

  const handleEditProfile = () => {
    router.push('/profile/settings');
  };

  const truncateLink = (link: string) => {
    if (screenWidth <= 393) {
      return link.length > 27 ? `${link.slice(0, 27)}...` : link;
    } else {
      return link.length > 35 ? `${link.slice(0, 35)}...` : link;
    }
  };

  if (!userInfo) {
    return <div>Загрузка...</div>;
  }

  return (
      <div className={styles.profile}>
        <ProfileHeader onAction={handleEditProfile}
                       photos={userInfo.photo_url}
                       iconAlt="Настройки"
                       iconSrc="/Settings_icon.svg"
                       title="Профиль"
                       width_icon={30}
                       height_icon={30}
        />
        <ProfileInfo screenWidth={screenWidth}
                     truncateLink={truncateLink}
                     coLife={profile.coLife}
                     about={userInfo.about}
                     interests={userInfo.hobby}
                     name={userInfo.first_name}
                     age={birthday.age}
                     gender={userInfo.sex}
                     religion={userInfo.religion}
                     socialLinks={userInfo.soc_media}
        />
      </div>
  );
};

export default Profile;
