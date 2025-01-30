// import React, { useEffect, useState } from "react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../config/firebase-config";
// import "../Css/Profile.css";

// const Profile = () => {
//   const [userData, setUserData] = useState(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedData, setEditedData] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const userId = "4dYceJwFI2RLQsIDKi1v2jsgoAI3"; // Static user ID
//   let touchStartX = 0;
//   let touchEndX = 0;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "Utilisateurs", userId));
//         if (userDoc.exists()) {
//           setUserData(userDoc.data());
//           setEditedData(userDoc.data());
//         } else {
//           console.log("No such user!");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleInputChange = (e) => {
//     setEditedData({ ...editedData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//       setImageUrl(""); // Clear URL input if file is uploaded
//     }
//   };

//   const handleUrlChange = (e) => {
//     setImageUrl(e.target.value);
//     setSelectedImage(""); // Clear file upload preview if URL is used
//   };

//   const handleSave = async () => {
//     try {
//       await updateDoc(doc(db, "Utilisateurs", userId), {
//         name: editedData.name,
//         prenom: editedData.prenom,
//         phone: editedData.phone,
//         address: editedData.address,
//         profileImage: imageUrl || selectedImage || editedData.profileImage, // URL takes priority, then file upload, then old image
//       });

//       setUserData((prev) => ({
//         ...prev,
//         name: editedData.name,
//         prenom: editedData.prenom,
//         phone: editedData.phone,
//         address: editedData.address,
//         profileImage: imageUrl || selectedImage || editedData.profileImage,
//       }));
      
//       setIsEditing(false);
//       console.log("User data updated successfully!");
//     } catch (error) {
//       console.error("Error updating user data:", error);
//     }
//   };

//   const handleTouchStart = (e) => {
//     touchStartX = e.changedTouches[0].screenX;
//   };

//   const handleTouchEnd = (e) => {
//     touchEndX = e.changedTouches[0].screenX;
//     if (touchEndX > touchStartX + 50) {
//       setIsExpanded(false);
//     }
//   };

//   if (!userData) {
//     return <div className="profile-container"><p>Loading user data...</p></div>;
//   }

//   return (
//     <div 
//       className={`profile-container ${isExpanded ? "expanded" : ""}`} 
//       onTouchStart={handleTouchStart} 
//       onTouchEnd={handleTouchEnd}
//     >
//       {/* Sidebar (Futuristic Neon Panel) */}
//       <div className="profile-sidebar" onClick={() => setIsExpanded(!isExpanded)}>
//         <div className="avatar-wrapper">
//           <img 
//             src={userData.profileImage} 
//             alt="User" 
//             className="profile-avatar"
//             onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} 
//           />
//           <div className="avatar-glow"></div> 
//         </div>
//         <h2 className="profile-name">{userData.prenom} {userData.name}</h2>
//         <p className="click-hint">➜ Tap to Access Data</p>

//         <div className="hologram">
//           <span className="holo-line"></span>
//           <span className="holo-line"></span>
//           <span className="holo-line"></span>
//         </div>
//       </div>

//       {/* Full-Screen Details Panel */}
//       <div className="profile-details">
//         <button className="close-btn" onClick={() => setIsExpanded(false)}>✖</button>

//         <h3 className="title-glow">👤 Information</h3>
//         <div className="info-section">
//           <label>Email:</label>
//           <p className="non-editable"><strong>{userData.email}</strong></p>

//           <label>Full Name:</label>
//           {isEditing ? (
//             <input type="text" name="prenom" value={editedData.prenom} onChange={handleInputChange} />
//           ) : (
//             <p><strong>{userData.prenom}</strong></p>
//           )}

//           <label>Last Name:</label>
//           {isEditing ? (
//             <input type="text" name="name" value={editedData.name} onChange={handleInputChange} />
//           ) : (
//             <p><strong>{userData.name}</strong></p>
//           )}

//           <label>Phone:</label>
//           {isEditing ? (
//             <input type="text" name="phone" value={editedData.phone} onChange={handleInputChange} />
//           ) : (
//             <p><strong>{userData.phone}</strong></p>
//           )}

//           <label>Address:</label>
//           {isEditing ? (
//             <input type="text" name="address" value={editedData.address} onChange={handleInputChange} />
//           ) : (
//             <p><strong>{userData.address}</strong></p>
//           )}

//           {/* Profile Image Upload OR URL Input */}
//           {isEditing && (
//             <div className="image-upload">
//               <input type="file" id="file-input" accept="image/*" onChange={handleImageChange} />
//               <label htmlFor="file-input" className="upload-btn">Upload Image</label>

//               <p>OR</p>

//               <input 
//                 type="text" 
//                 placeholder="Paste image URL" 
//                 value={imageUrl} 
//                 onChange={handleUrlChange} 
//                 className="neon-input"
//               />

//               {(selectedImage || imageUrl) && (
//                 <img 
//                   src={selectedImage || imageUrl} 
//                   alt="Preview" 
//                   className="image-preview"
//                 />
//               )}
//             </div>
//           )}
//         </div>

//         {!isEditing ? (
//           <button className="edit-btn" onClick={handleEdit}>Modify</button>
//         ) : (
//           <button className="save-btn" onClick={handleSave}>Save</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProfilePage = ({ userData = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(userData.profileImage || "");
  const [hasChanges, setHasChanges] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white">
      <Card className="w-full max-w-lg bg-opacity-90 shadow-xl backdrop-blur-lg rounded-xl border border-gray-700">
        <CardHeader className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-blue-500 shadow-md hover:shadow-blue-500 transition-shadow duration-300">
            <Avatar className="w-full h-full">
              <AvatarImage src={selectedImage || imageUrl} alt="User" className="rounded-full" />
              <AvatarFallback className="text-3xl bg-zinc-700 text-white">
                {editedData.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-3xl font-bold">{editedData.prenom} {editedData.name}</h2>
          <p className="text-md text-gray-400">{editedData.email}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Label className="text-gray-300">Email</Label>
            <Input value={editedData.email} disabled className="bg-gray-800 text-gray-300 border-none" />
          </div>
          <div>
            <Label className="text-gray-300">First Name</Label>
            <Input 
              name="prenom" 
              value={editedData.prenom} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
              className="bg-gray-800 text-gray-300 border-none"
            />
          </div>
          <div>
            <Label className="text-gray-300">Last Name</Label>
            <Input 
              name="name" 
              value={editedData.name} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
              className="bg-gray-800 text-gray-300 border-none"
            />
          </div>
          <div>
            <Label className="text-gray-300">Phone</Label>
            <Input 
              name="phone" 
              value={editedData.phone} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
              className="bg-gray-800 text-gray-300 border-none"
            />
          </div>
          <div>
            <Label className="text-gray-300">Address</Label>
            <Textarea 
              name="address" 
              value={editedData.address} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
              className="bg-gray-800 text-gray-300 border-none"
            />
          </div>

          {isEditing && (
            <div className="mt-4 space-y-3">
              <Label className="text-gray-300">Profile Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} className="text-gray-300"/>
              <Input 
                type="text" 
                placeholder="Paste image URL" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                className="bg-gray-800 text-gray-300 border-none"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105"
              >
                {hasChanges ? "Save Changes" : "No Changes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                className="border border-gray-500 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleEdit} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full transition-transform transform hover:scale-105"
            >
              Modify
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
