import { useTheme } from '@emotion/react'
import { Box, SvgIcon } from '@mui/material'
import React, { useState } from 'react'
import "./logo.css";

const SplashScreen = () => {

	return (
		<div className="splash-screen">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="224mm"
				height="224mm"
				viewBox="0 0 224 224"
				version="1.1"
				id="svg1"
			>
				<g id="layer1">
					<rect
						id="rect1"
						className="animate-rect1"
						width="224"
						height="224"
						x="0"
						y="0"
						style={{
							fill: "#607d8b",
							fillOpacity: 1,
							strokeWidth: "2.58753",
						}}
					/>
					<rect
						id="rect2"
						className="animate-rect2"
						width="89.04"
						height="180.04"
						x="67.96"
						y="12.57"
						style={{
							fill: "none",
							stroke: "#ffffff",
							strokeWidth: "5.18238",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeMiterlimit: 38.3,
						}}
					/>
					<path
						id="path2"
						className="animate-path2"
						d="M 106.92 19.96 h 12.54"
						style={{
							fill: "none",
							stroke: "#ffffff",
							strokeWidth: "3.49026",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeMiterlimit: 38.3,
						}}
					/>
					<rect
						id="rect6"
						className="animate-rect3"
						width="89.04"
						height="180.04"
						x="91.14"
						y="30.70"
						style={{ fill: "#808080", stroke: "none" }}
					/>
					<rect
						id="rect3"
						className="animate-rect4"
						width="89.04"
						height="180.04"
						x="93.78"
						y="33.35"
						style={{ fill: "#3d7592", stroke: "none" }}
					/>
					<text
						id="text3"
						className="animate-text1"
						x="111.23"
						y="108.97"
						style={{
							fontSize: "17.051px",
							fontFamily: "Go Smallcaps",
							fill: "#d5e5ff",
						}}
					>
						phone
					</text>
					<text
						id="text6"
						className="animate-text2"
						x="104.98"
						y="122.17"
						style={{
							fontSize: "17.051px",
							fontFamily: "Go Smallcaps",
							fill: "#d5e5ff",
						}}
					>
						mocker
					</text>
				</g>
			</svg>
		</div>
	)
};


function LoadingScreen() {
	const theme = useTheme()
	return (
		<Box sx={{
			display: 'flex',
			height: '100vh',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.palette.primary.main
		}}>
			<Box width={300} height={300}>
				<SplashScreen />
			</Box>
		</Box>
	)
}

export default LoadingScreen