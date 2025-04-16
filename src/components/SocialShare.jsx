import React from 'react';
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  LinkedinShareButton, LinkedinIcon,
  RedditShareButton, RedditIcon,
  WhatsappShareButton, WhatsappIcon,
  EmailShareButton, EmailIcon
} from 'react-share';

const SocialShare = ({ post, url }) => {
  const shareUrl = url || window.location.href;
  const title = post?.title || 'Check out this blog post';
  const excerpt = post?.excerpt || '';
  
  return (
    <div className="my-8">
      <h4 className="text-lg font-semibold mb-4">Share this post</h4>
      <div className="flex flex-wrap gap-2">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={36} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={36} round />
        </TwitterShareButton>
        
        <LinkedinShareButton url={shareUrl} title={title} summary={excerpt}>
          <LinkedinIcon size={36} round />
        </LinkedinShareButton>
        
        <RedditShareButton url={shareUrl} title={title}>
          <RedditIcon size={36} round />
        </RedditShareButton>
        
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={36} round />
        </WhatsappShareButton>
        
        <EmailShareButton url={shareUrl} subject={title} body={`Check out this post: ${title}\n${excerpt}\n${shareUrl}`}>
          <EmailIcon size={36} round />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default SocialShare; 