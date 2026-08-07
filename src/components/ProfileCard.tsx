import React from "react";
import * as Icons from "lucide-react";

interface ProfileCardProps {
  id: string;
  title: string;
  iconName: string;
  description: string;
  onClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  iconName,
  description,
  onClick
}) => {
  // Dynamically resolve the icon component from Lucide
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <button onClick={onClick} className="profile-card">
      <div className="card-icon-container">
        <IconComponent size={24} />
      </div>
      <div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description" style={{ marginTop: "8px" }}>
          {description}
        </p>
      </div>
      <div className="card-footer-action">
        <span>Comenzar conversación</span>
        <Icons.ArrowRight size={16} />
      </div>
    </button>
  );
};
