import { useSelectedPageContext } from "@/hooks/use-context";
import * as React from "react";
import { useState } from "react";
import Select from "react-select";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa6"; // Added FaEye and FaEyeSlash
import { useAppDispatch } from "@/hooks/use-dispatch";
import { logout } from "@/stores/actions/authAction";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiUpdateProfile } from "@/services/user.services";
import toast from "react-hot-toast";
import { getCurrent } from "@/stores/actions/userAction";

const Settings: React.FC = () => {
  const { selectedPage, setSelectedPage } = useSelectedPageContext();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state: RootState) => state.user);
  const [activeSection, setActiveSection] = useState(selectedPage || "Profile");
  const [profileSubSection, setProfileSubSection] = useState("");
  const [emailNotifications, setEmailNotifications] = useState({
    specialOffers: true,
    learningEmails: true,
  });
  const [appNotifications, setAppNotifications] = useState({
    specialOffers: true,
    learningNotifications: false,
  });
  const [editedUserData, setEditedUserData] = useState({
    firstname: userData?.firstname || "",
    lastname: userData?.lastname || "",
    avatar: userData?.avatar || null,
    avatarPreview: userData?.avatar || "",
    gender: userData?.gender || "",
    address: userData?.address || "",
    phoneNumber: userData?.phoneNumber || "",
  });
  // States for password management
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  React.useEffect(() => {
    if (selectedPage === "Settings" || selectedPage === "Profile") {
      setActiveSection(selectedPage);
      setProfileSubSection("");
    } else {
      setActiveSection("Profile");
    }
  }, [selectedPage]);
  React.useEffect(() => {
    if (profileSubSection === "Personal details") {
      dispatch(getCurrent());
    }
  }, [dispatch, profileSubSection]);
  React.useEffect(() => {
    setEditedUserData({
      firstname: userData?.firstname || "",
      lastname: userData?.lastname || "",
      avatar: null,
      avatarPreview: userData?.avatar || "",
      gender: userData?.gender || "",
      address: userData?.address || "",
      phoneNumber: userData?.phoneNumber || "",
    });
  }, [userData, profileSubSection]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setProfileSubSection("");
  };

  const handleProfileSubSectionChange = (subSection: string) => {
    setProfileSubSection(subSection);
  };

  const toggleEmailNotification = (
    type: "specialOffers" | "learningEmails"
  ) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleAppNotification = (
    type: "specialOffers" | "learningNotifications"
  ) => {
    setAppNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUserData((prev) => ({
          ...prev,
          avatar: file,
          avatarPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", editedUserData.firstname);
    formData.append("lastname", editedUserData.lastname);
    formData.append("phoneNumber", editedUserData.phoneNumber);
    formData.append("gender", editedUserData.gender);
    formData.append("address", editedUserData.address);
    if (editedUserData.avatar instanceof File) {
      console.log("Appending file:", editedUserData.avatar);
      formData.append("avatar", editedUserData.avatar);
    }

    try {
      const response = await apiUpdateProfile(formData);
      console.log(response);
      if (response?.data?.success) {
        toast.success("Profile updated successfully");
        setProfileSubSection("");
      }
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.repeatPassword) {
      setPasswordError("New password and repeat password do not match");
      return;
    }

    try {
      // await apiUpdatePassword(passwordData);
      const response = await apiUpdateProfile({
        currentPassword: passwordData?.currentPassword,
        password: passwordData.repeatPassword,
      });
      console.log(response);
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error.message);
      toast.error("Failed to update password");
    }
  };

  const languages = [
    {
      value: "english",
      label: "English",
      flag: "https://flagcdn.com/w20/gb.png",
    },
    {
      value: "afrikaans",
      label: "Afrikaans",
      flag: "https://flagcdn.com/w20/za.png",
    },
    {
      value: "spanish",
      label: "Spanish",
      flag: "https://flagcdn.com/w20/es.png",
    },
    {
      value: "french",
      label: "French",
      flag: "https://flagcdn.com/w20/fr.png",
    },
  ];

  const levels = [
    { value: "A1", label: "Absolute beginner (A1)" },
    { value: "A2", label: "Beginner (A2)" },
    { value: "B1-B2", label: "Intermediate (B1 - B2)" },
    { value: "C1-C2", label: "Advanced (C1 - C2)" },
  ];

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": { borderColor: "#e5e7eb" },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      padding: "0.5rem",
      backgroundColor: state.isSelected ? "#f0f9ff" : "white",
      color: "black",
      "&:hover": { backgroundColor: "#f0f9ff" },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full mx-auto flex min-h-screen bg-white rounded-xl shadow-lg px-4">
        <div className="w-1/2 border-r border-gray-200 py-2">
          <div
            className="flex items-center justify-start gap-2 mb-12"
            onClick={() => {
              setSelectedPage("Home");
            }}
          >
            <FaArrowLeft fontSize={20} className="cursor-pointer" />
            <span className="text-[22px] font-medium text-gray-900">
              Account
            </span>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Target language
          </h2>
          <div className="py-4 bg-gray-50 rounded-xl mb-4">
            <Select
              options={languages}
              defaultValue={languages[0]}
              styles={customSelectStyles}
              formatOptionLabel={(option) => (
                <div className="flex items-center">
                  <img
                    src={option.flag}
                    alt={`${option.label} flag`}
                    className="w-5 h-5 mr-2"
                  />
                  <span>{option.label}</span>
                </div>
              )}
            />
          </div>
          <h1 className="text-xl font-medium text-gray-900 mb-6">Account</h1>
          <ul className="space-y-6">
            <li
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                activeSection === "Profile"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-700 hover:bg-gray-100 font-medium"
              }`}
              onClick={() => {
                handleSectionChange("Profile");
              }}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span className="text-[15px] font-medium">Profile</span>
            </li>
            <li
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                activeSection === "Settings"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-700 hover:bg-gray-100 font-medium"
              }`}
              onClick={() => handleSectionChange("Settings")}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                ></path>
              </svg>
              <span className="text-[15px] font-medium">Settings</span>
            </li>
            <li
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                activeSection === "Theme"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-700 hover:bg-gray-100 font-medium"
              }`}
              onClick={() => handleSectionChange("Theme")}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                ></path>
              </svg>
              <span className="text-[15px] font-medium">Theme</span>
              <span className="ml-auto bg-pink-500 text-white text-sm font-medium px-3 py-1 rounded-full rotate-45">
                PREMIUM
              </span>
            </li>
            <li
              className="flex items-center p-3 rounded-xl cursor-pointer text-pink-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                handleSectionChange("Logout");
                dispatch(logout());
                navigate("/auth");
              }}
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span className="text-[15px] font-medium">Log out</span>
            </li>
          </ul>
        </div>

        <div className="w-1/2 py-2 px-8">
          {activeSection === "Profile" && (
            <div className="space-y-6">
              {profileSubSection === "Personal details" ? (
                <div className="min-h-screen flex flex-col justify-between">
                  <div>
                    <div
                      className="flex items-center justify-start gap-3 mb-8"
                      onClick={() => {
                        setProfileSubSection("");
                      }}
                    >
                      <FaArrowLeft fontSize={20} className="cursor-pointer" />
                      <h6 className="text-xl font-semibold text-gray-900">
                        Personal details
                      </h6>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          value={editedUserData.firstname}
                          onChange={handleInputChange}
                          className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          value={editedUserData.lastname}
                          onChange={handleInputChange}
                          className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Your time zone
                        </label>
                        <select className="w-full p-3 mt-1 border border-gray-300 rounded-xl">
                          <option>UTC+07:00</option>
                          <option>UTC+00:00</option>
                          <option>UTC+01:00</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Profile Picture
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                          {editedUserData.avatarPreview && (
                            <img
                              src={editedUserData.avatarPreview}
                              alt="Profile Preview"
                              className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
                            />
                          )}
                          <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition duration-200"
                          >
                            Upload Image
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button
                      onClick={handleSave}
                      className="w-full bg-blue-600 text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : profileSubSection === "Change password" ? (
                <div className="p-4 rounded-xl">
                  <div
                    className="flex items-center justify-start gap-3 mb-8"
                    onClick={() => setProfileSubSection("")}
                  >
                    <FaArrowLeft fontSize={20} className="cursor-pointer" />
                    <h6 className="text-xl font-semibold text-gray-900">
                      Change Password
                    </h6>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">
                        Current password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Current Password"
                          className="w-full p-2 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-2 top-3 text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        New password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="New Password"
                          className="w-full p-2 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-3 text-gray-600"
                        >
                          {showNewPassword ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Repeat password
                      </label>
                      <div className="relative">
                        <input
                          type={showRepeatPassword ? "text" : "password"}
                          name="repeatPassword"
                          value={passwordData.repeatPassword}
                          onChange={handlePasswordChange}
                          placeholder="Repeat Password"
                          className={`w-full p-2 mt-1 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            passwordError ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRepeatPassword(!showRepeatPassword)
                          }
                          className="absolute right-2 top-3 text-gray-600"
                        >
                          {showRepeatPassword ? (
                            <FaEyeSlash className="w-5 h-5" />
                          ) : (
                            <FaEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-500 mt-1">
                          {passwordError}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handlePasswordSave}
                      className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <p className="text-center text-sm text-gray-600">
                      Forgot password?{" "}
                      <button className="text-blue-600 underline">
                        Click here
                      </button>
                    </p>
                  </div>
                </div>
              ) : profileSubSection === "Email notifications" ? (
                <div className="p-4">
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-start gap-3 mb-8"
                      onClick={() => setProfileSubSection("")}
                    >
                      <FaArrowLeft fontSize={20} className="cursor-pointer" />
                      <h6 className="text-xl font-semibold text-gray-900">
                        Email Notifications
                      </h6>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Special offers
                      </h3>
                      <p className="text-xs text-gray-500">
                        Receive special offers and new feature announcements.
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">
                          Special offers
                        </span>
                        <button
                          onClick={() =>
                            toggleEmailNotification("specialOffers")
                          }
                          className={`w-12 h-6 rounded-full p-1 ${
                            emailNotifications.specialOffers
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              emailNotifications.specialOffers
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Learning emails
                      </h3>
                      <p className="text-xs text-gray-500">
                        Stay on top of your language learning journey. Receive
                        study reminders, practice summaries, and learning tips.
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">
                          Learning emails
                        </span>
                        <button
                          onClick={() =>
                            toggleEmailNotification("learningEmails")
                          }
                          className={`w-12 h-6 rounded-full p-1 ${
                            emailNotifications.learningEmails
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              emailNotifications.learningEmails
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      <button className="text-blue-600 underline">
                        Unsubscribe from all
                      </button>
                    </p>
                  </div>
                </div>
              ) : profileSubSection === "App notifications" ? (
                <div className="p-4">
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-start gap-3 mb-8"
                      onClick={() => setProfileSubSection("")}
                    >
                      <FaArrowLeft fontSize={20} className="cursor-pointer" />
                      <h6 className="text-xl font-semibold text-gray-900">
                        App Notifications
                      </h6>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Special offers
                      </h3>
                      <p className="text-xs text-gray-500">
                        Receive special offers and new feature announcements.
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">
                          Special offers
                        </span>
                        <button
                          onClick={() => toggleAppNotification("specialOffers")}
                          className={`w-12 h-6 rounded-full p-1 ${
                            appNotifications.specialOffers
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              appNotifications.specialOffers
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Learning notifications
                      </h3>
                      <p className="text-xs text-gray-500">
                        Stay on top of your language learning journey. Receive
                        study reminders, practice summaries, and learning tips.
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-700">
                          Learning notifications
                        </span>
                        <button
                          onClick={() =>
                            toggleAppNotification("learningNotifications")
                          }
                          className={`w-12 h-6 rounded-full p-1 ${
                            appNotifications.learningNotifications
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              appNotifications.learningNotifications
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      <button className="text-blue-600 underline">
                        Unsubscribe from all
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className="flex items-center justify-start gap-2 mb-6"
                    onClick={() => setActiveSection("")}
                  >
                    <FaArrowLeft fontSize={20} className="cursor-pointer" />
                    <span className="text-xl font-medium text-gray-900">
                      Profile
                    </span>
                  </div>
                  <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    <div
                      className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() =>
                        handleProfileSubSectionChange("Personal details")
                      }
                    >
                      <svg
                        className="w-6 h-6 mr-3 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Personal details
                        </h3>
                        <p className="text-xs text-gray-500">
                          Manage your personal details below.
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() =>
                        handleProfileSubSectionChange("Change password")
                      }
                    >
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#4B5563"
                          d="M12 1a5 5 0 00-5 5v4H6a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V11a1 1 0 00-1-1h-1V6a5 5 0 00-5-5zm-3 9V6a3 3 0 016 0v4H9zm3 4a1.5 1.5 0 11-1.5 1.5A1.5 1.5 0 0112 14z"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Change password
                        </h3>
                        <p className="text-xs text-gray-500">
                          Change your current password.
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() =>
                        handleProfileSubSectionChange("Email notifications")
                      }
                    >
                      <svg
                        className="w-6 h-6 mr-3 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Email notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          Manage your email notifications.
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() =>
                        handleProfileSubSectionChange("App notifications")
                      }
                    >
                      <svg
                        className="w-6 h-6 mr-3 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        ></path>
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          App notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          Manage your app notifications.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <svg
                        className="w-6 h-6 mr-3 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H8V5a2 2 0 012-2z"
                        ></path>
                      </svg>
                      <div className="cursor-pointer">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Delete account
                        </h3>
                        <p className="text-xs text-gray-500">
                          This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "Settings" && (
            <div className="h-screen w-full overflow-y-auto pb-12">
              <div
                className="flex items-center justify-start gap-3 mb-8"
                onClick={() => setActiveSection("")}
              >
                <FaArrowLeft fontSize={20} className="cursor-pointer" />
                <h6 className="text-xl font-semibold text-gray-900">
                  Account settings
                </h6>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Choose interface language
                  </h3>
                  <Select
                    options={languages}
                    defaultValue={languages[0]}
                    styles={customSelectStyles}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center">
                        <img
                          src={option.flag}
                          alt={`${option.label} flag`}
                          className="w-5 h-5 mr-2"
                        />
                        <span>{option.label}</span>
                      </div>
                    )}
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Choose translation language
                  </h3>
                  <Select
                    options={languages}
                    defaultValue={languages[1]}
                    styles={customSelectStyles}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center">
                        <img
                          src={option.flag}
                          alt={`${option.label} flag`}
                          className="w-5 h-5 mr-2"
                        />
                        <span>{option.label}</span>
                      </div>
                    )}
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Choose target language
                  </h3>
                  <Select
                    options={languages}
                    defaultValue={languages[0]}
                    styles={customSelectStyles}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center">
                        <img
                          src={option.flag}
                          alt={`${option.label} flag`}
                          className="w-5 h-5 mr-2"
                        />
                        <span>{option.label}</span>
                      </div>
                    )}
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Change your target language level
                  </h3>
                  <Select
                    options={levels}
                    placeholder="Choose level"
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "Theme" && (
            <div>
              <div
                className="flex items-center justify-start gap-3 mb-8"
                onClick={() => setActiveSection("")}
              >
                <FaArrowLeft fontSize={20} className="cursor-pointer" />
                <h6 className="text-xl font-semibold text-gray-900">Theme</h6>
              </div>
              <p className="text-sm text-gray-500">Manage your theme.</p>
            </div>
          )}

          {activeSection === "Logout" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Log out
              </h2>
              <p className="text-sm text-gray-500">
                Log out from this profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
