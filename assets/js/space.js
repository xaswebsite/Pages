const SpaceBackgroundState = {
	canvas: null,
	gl: null,
	mouseX: 0,
	mouseY: 0,

	vertex_shader: `#version 300 es

	precision highp float;

	in vec4 aPosition;
	out vec2 fragCoord;

	uniform vec2 Resolution;

	void main() {

		fragCoord.x = (aPosition.x + 1.) * 0.5 * Resolution.x;
		fragCoord.y = (1. - aPosition.y) * 0.5 * Resolution.y;

		gl_Position = aPosition;
	}`,

	fragment_shader: `#version 300 es

	precision highp float;

	in  vec2 fragCoord;
	out vec4 FragColor;

	uniform vec2 Resolution;
	uniform vec2 MousePos;
	uniform sampler2D Background;

	void main() {

		vec2 uv = fragCoord / Resolution;

		float as = Resolution.x / Resolution.y;
		uv.y /= as;

		vec2 center = MousePos / Resolution;
		center.y /= as;

	    	float dw = max(Resolution.x, Resolution.y) / 80.;
	    	float wi = 100.;

		vec2 duv = uv - center;

		float scale = 1.;
		float mass = 0.0005;
		float len2 = duv.x * duv.x + duv.y * duv.y;
		float len = sqrt(len2); 

		float inte = scale * mass / len2;

		vec2 suv = uv + normalize(duv) * inte;
		
		vec2 muv = vec2(mod(suv.x, 1./dw), mod(suv.y, 1./dw));
		
		vec2 smt = dw / 4. * (dw * muv * muv - muv + 4./dw);
		
		smt.x = pow(smt.x, wi);
		smt.y = pow(smt.y, wi);
		
		float t = pow(smt.x + smt.y, 2.) * 0.3;

    		vec4 fromTex = texture(Background, suv);

		// vec4 col = mix(fromTex, vec4(0.5, 0.5, 0.5, 1.0), t) * (inte + 1.);
		vec4 mask = mix(vec4(0., 0., 0., 1.), vec4(1., 1., 1., 1.0), len2 / (mass * sqrt(dw) * 0.5 * scale));
		
		FragColor = min(fromTex, mask);
	}`,

	program: 0,

	vao: 0,

	buffer: [
		-1.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,

		 1.0, 1.0,
		-1.0, 1.0,
		-1.0,-1.0
	],

	vbo: 0,

	Resolution: 0,
	MousePos: 0,
	Background: 0,
	Sampler: 0,

	BackgroundImageTexture: 0
}

function SpaceLoadShader() {
	const canvas = SpaceBackgroundState.canvas
	const gl = SpaceBackgroundState.gl

	const vsid = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vsid, SpaceBackgroundState.vertex_shader);
	gl.compileShader(vsid);

	if(!gl.getShaderParameter(vsid, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vsid));
	}

	const fsid = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fsid, SpaceBackgroundState.fragment_shader);
	gl.compileShader(fsid);

	if(!gl.getShaderParameter(fsid, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fsid));
	}

	let program = gl.createProgram();
	gl.attachShader(program, vsid);
	gl.attachShader(program, fsid);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		program = 0;
	}

	SpaceBackgroundState.program = program;

	gl.deleteShader(vsid);
	gl.deleteShader(fsid);
}

function SpaceGeneratePlane() {
	const canvas = SpaceBackgroundState.canvas
	const gl = SpaceBackgroundState.gl

	const data = new Float32Array(SpaceBackgroundState.buffer)

	const aPosition = gl.getAttribLocation(SpaceBackgroundState.program, "aPosition");

	SpaceBackgroundState.vao = gl.createVertexArray();
	gl.bindVertexArray(SpaceBackgroundState.vao);
	
	SpaceBackgroundState.vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, SpaceBackgroundState.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(aPosition);
	gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
}

function SpaceLoadImage() {
	const canvas = SpaceBackgroundState.canvas;
	const gl = SpaceBackgroundState.gl;

	SpaceBackgroundState.BackgroundImageTexture = new Image();

	SpaceBackgroundState.BackgroundImageTexture.onload = (e) => {
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, SpaceBackgroundState.Background);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SpaceBackgroundState.BackgroundImageTexture);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.uniform1i(SpaceBackgroundState.Sampler, 0);

		SpaceBackgroundUpdate();
	};

	SpaceBackgroundState.BackgroundImageTexture.src = document.querySelector('#spacebackground-image').src
}

function SpaceBackgroundInit() {
	const canvas = SpaceBackgroundState.canvas = document.querySelector('#spacebackground-canvas');
	const gl = SpaceBackgroundState.gl = canvas.getContext('webgl2')

	if(!gl) {
		console.log('Could not create a webgl2 context. Bailing out');
		canvas.remove();
		return;
	}

	window.addEventListener('mousemove', (e) => {
		SpaceBackgroundState.mouseX = e.x;
		SpaceBackgroundState.mouseY = e.y;

		SpaceBackgroundUpdate()
	});

	window.addEventListener('resize', SpaceBackgroundResize);

	SpaceBackgroundState.mouseX = canvas.width / 2;
	SpaceBackgroundState.mouseY = canvas.height / 2;

	SpaceLoadShader();
	SpaceGeneratePlane();
	SpaceLoadImage();

	SpaceBackgroundState.Resolution = gl.getUniformLocation(SpaceBackgroundState.program, 'Resolution');
	SpaceBackgroundState.MousePos = gl.getUniformLocation(SpaceBackgroundState.program, 'MousePos');
	SpaceBackgroundState.Sampler = gl.getUniformLocation(SpaceBackgroundState.program, 'Background');
	SpaceBackgroundState.Background = gl.createTexture();

	SpaceBackgroundResize();
}

function SpaceBackgroundResize() {
	const canvas = SpaceBackgroundState.canvas
	const gl = SpaceBackgroundState.gl

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl.viewport(0, 0, canvas.width, canvas.height);

	SpaceBackgroundUpdate();
}

function SpaceBackgroundUpdate() {
	const canvas = SpaceBackgroundState.canvas;
	const gl = SpaceBackgroundState.gl;

	gl.clearColor(0.8, 0.0, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(SpaceBackgroundState.program);
	gl.bindVertexArray(SpaceBackgroundState.vao);

	gl.uniform2f(SpaceBackgroundState.Resolution, canvas.width, canvas.height);
	gl.uniform2f(SpaceBackgroundState.MousePos, SpaceBackgroundState.mouseX, SpaceBackgroundState.mouseY);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

window.addEventListener('load', SpaceBackgroundInit);
