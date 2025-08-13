import "./profile.css"
import Sidebar from "../../components/Sidebar"
import Feed from "../../components/Feed"
import Widgets from "../../components/Widgets"

export default function Profile() {
  return (
    <div className="profileLayout">
      <Sidebar />

      <div className="mainFeed">
        <div className="profileHeader">
          <img
            className="coverPhoto"
            src="/assets/profile/cover.jpg"
            alt="cover"
          />
          <div className="profileAvatarWrapper">
            <img
              className="profileAvatar"
              src="/assets/profile/avatar.jpg"
              alt="avatar"
            />
            <div className="profileUserInfo">
              <h2 className="profileName">Safak Kocaoglu</h2>
              <p className="profileUsername">@safak</p>
              <p className="profileBio">Frontend Dev. Coffee addict ☕</p>
            </div>
          </div>
        </div>

        <Feed isProfile />
      </div>

      <Widgets />
    </div>
  )
}
