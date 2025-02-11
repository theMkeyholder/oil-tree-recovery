// ************ Themes ************
const themes = {
	1: "aqua"
};
const theme_names = {
	aqua: "Aqua"
};
var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
}
function changeTheme() {
	let aqua = options.theme == "aqua";
	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', aqua ? "#001f3f" : "#0f0f0f");
	document.body.style.setProperty('--background_tooltip', aqua ? "rgba(0, 15, 31, 0.75)" : "rgba(0, 0, 0, 0.75)");
	document.body.style.setProperty('--color', aqua ? "#bfdfff" : "#dfdfdf");
	document.body.style.setProperty('--points', aqua ? "#dfefff" : "#ffffff");
	document.body.style.setProperty("--locked", aqua ? "#c4a7b3" : "#bf8f8f");
}
function getThemeName() {
	return options.theme ? theme_names[options.theme] : "Default";
}
function switchTheme() {
	if (options.theme === null)
		options.theme = themes[1];
	else {
		options.theme = themes[Object.keys(themes)[options.theme] + 1];
		if (!options.theme)
			options.theme = null;
	}
	changeTheme();
	resizeCanvas();
}
