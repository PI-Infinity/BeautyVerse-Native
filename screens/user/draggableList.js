import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

export const DragableList = ({ file: initialFile }) => {
  const [file, setFile] = useState(initialFile);
  console.log(initialFile?.length);
  const renderItem = (arg) => {
    console.log(arg); // Now index should be defined
    const { item, index, onDragEnd, isActive } = arg;
    return (
      <TouchableOpacity
        style={{
          height: 100,
          backgroundColor: isActive ? "blue" : "red",
          alignItems: "center",
          justifyContent: "center",
        }}
        onLongPress={drag}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: 32,
          }}
        >
          {item.height}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={file}
        renderItem={renderItem} // Corrected this line
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data }) => setFile(data)} // Corrected this line, setfile -> setFile
        scrollEnabled={false}
        style={{ backgroundColor: "red", flex: 1 }}
        numColumns={3}
      />
    </View>
  );
};
