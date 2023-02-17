export default function QuillConfig(value) {
  if (value === "formats") {
    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "size",
      "color",
      "list",
      "bullet",
      "link",
      "align",
      "background",
    ];

    return formats;
  }
  if (value === "modules") {
    const modules = {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { size: ["small", false, "large", "huge"] },
            { color: [] },
            { background: [] },
          ],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["link", "clean"],
        ],
      },
      clipboard: { matchVisual: false },
    };

    return modules;
  }
}
