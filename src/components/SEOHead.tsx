import React from 'react';
import { GroupInfo } from '../hooks/api';

interface SEOHeadProps {
  groupInfo?: GroupInfo;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ groupInfo }) => {
  React.useEffect(() => {
    if (!groupInfo) return;

    // Динамически обновляем title и meta description на основе данных группы
    document.title = `${groupInfo.name} (I HATE REALITY) — VRChat группа с ${groupInfo.member_count}+ участниками`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `🎮 Официальная VRChat группа ${groupInfo.name} (I HATE REALITY). ${groupInfo.member_count}+ участников, ${groupInfo.online_member_count} онлайн. Присоединяйся к русскоговорящему сообществу виртуальной реальности!`
      );
    }

    // Обновляем Open Graph теги
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${groupInfo.name} (I HATE REALITY) — VRChat группа с ${groupInfo.member_count}+ участниками`);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 
        `🎮 Присоединяйся к крупнейшему русскоговорящему VRChat сообществу! ${groupInfo.member_count}+ участников, ${groupInfo.online_member_count} онлайн. Активные инстансы, события, дружная атмосфера.`
      );
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && groupInfo.icon_url) {
      ogImage.setAttribute('content', groupInfo.icon_url);
    }

    // Обновляем Twitter теги
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', `${groupInfo.name} (I HATE REALITY) — VRChat группа`);
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 
        `🎮 Официальная VRChat группа с ${groupInfo.member_count}+ участниками. ${groupInfo.online_member_count} онлайн. Активные инстансы, события, русскоговорящее сообщество.`
      );
    }

    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage && groupInfo.icon_url) {
      twitterImage.setAttribute('content', groupInfo.icon_url);
    }

    // Добавляем структурированные данные для группы
    const existingScript = document.querySelector('script[data-schema="group"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'group');
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": `${groupInfo.name} (I HATE REALITY)`,
      "alternateName": groupInfo.name,
      "url": "https://karmavr.ru",
      "logo": groupInfo.icon_url,
      "image": groupInfo.banner_url,
      "description": groupInfo.description.substring(0, 300) + "...",
      "foundingDate": groupInfo.created_at,
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": groupInfo.member_count
      },
      "memberOf": {
        "@type": "VideoGame",
        "name": "VRChat",
        "publisher": "VRChat Inc."
      },
      "sameAs": [
        ...groupInfo.links,
        `https://vrchat.com/home/group/${groupInfo.id}`
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Russian"
      },
      "audience": {
        "@type": "Audience",
        "audienceType": "VRChat players, Virtual Reality enthusiasts, Russian speakers"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": groupInfo.member_count,
        "bestRating": "5"
      }
    });
    
    document.head.appendChild(script);

  }, [groupInfo]);

  return null;
};