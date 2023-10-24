import React, { useState } from "react";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";

export const CoverSection = ({ user }) => {
  // redux dispatch
  const dispatch = useDispatch();
  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(user?.type);
  const name = capitalizeFirstLetter(user?.name);

  let type;
  if (user.type === "specialist") {
    type = t;
  } else if (user.type === "shop") {
    type = t;
  } else if (user.type === "beautycenter") {
    type = "Beauty Salon";
  } else if (user.type === "user") {
    type = "User";
  }

  // image loading opacity
  const [opacity, setOpacity] = useState(true);

  /**
   * cover upload
   */
  const [file, setFile] = useState(undefined);

  // Function to resize and compress image
  const resizeAndCompressImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500; // Max width for the image
        const scaleFactor = MAX_WIDTH / img.width; // Maintain aspect ratio
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

        // Here, you would set the compressed image file for upload or preview
        setFile(compressedImage);
      };
    };
  };

  /**
   *
   *  upload cover file
   */

  // async function FileUpload() {
  //   /* aadd cover
  //    */
  //   if (file == null) return;
  //   if (file != null) {
  //     setLoading(true);
  //     // add in storage
  //     const imageRef = ref(storage, `images/${targetUser?._id}/cover`);

  //     const coverBlob = await uriToBlob(file?.cover.base64);
  //     await uploadBytes(imageRef, coverBlob).then((snapshot) => {
  //       getDownloadURL(snapshot.ref)
  //         .then((url) => {
  //           const UploadCover = async () => {
  //             const response = await axios.patch(
  //               `${backendUrl}/api/v1/users/${targetUser?._id}`,
  //               {
  //                 cover: url,
  //               }
  //             );
  //           };
  //           if (url) {
  //             UploadCover();
  //           }
  //           dispatch(setRerenderCurrentUser());
  //           dispatch(setCleanUp());
  //           setLoading(false);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     });
  //   }
  // }

  return (
    <Container>
      <CoverImageContainer>
        {user?.cover?.length > 0 ? (
          <CoverImage
            src={user?.cover}
            opacity={opacity ? "true" : "false"}
            onLoad={() => setOpacity(false)}
          />
        ) : (
          <FaUser size={40} color="#aaa" />
        )}

        <input
          type="file"
          value={file}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              resizeAndCompressImage(file);
            }
          }}
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "25vw",
            height: "25vw",
            background: "red",
            borderRadius: "50px",
            opacity: 0,
          }}
        />
      </CoverImageContainer>
      <InfoContainer>
        <h3 style={{ color: "#ccc", margin: 0, letterSpacing: "0.5px" }}>
          {type}
        </h3>
        <p style={{ color: "#ccc", margin: 0, letterSpacing: "0.5px" }}>
          {user?.about}
        </p>
      </InfoContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 25px 20px 10px 20px;
  display: flex;
  gap: 10vw;
`;

const CoverImageContainer = styled.div`
  width: 25vw;
  height: 25vw;
  border-radius: 50vw;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoverImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50vw;
  opacity: ${(props) => (props.opacity === "true" ? "0" : "1")};
  transition: ease-in 500ms;
`;

const InfoContainer = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;
