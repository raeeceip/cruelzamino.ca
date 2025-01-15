import emailjs from "@emailjs/browser";
import React, { useState } from "react";

const Hair = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		appointmentDate: "",
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		emailjs
			.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_USER_ID")
			.then(
				(result) => {
					alert("Appointment request sent successfully!");
					setFormData({
						name: "",
						email: "",
						phone: "",
						appointmentDate: "",
						message: "",
					});
				},
				(error) => {
					alert("Failed to send appointment request.");
				}
			);
	};

	return (
		<div>
			<h1>Book a Hair Appointment</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Phone:</label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Appointment Date:</label>
					<input
						type="date"
						name="appointmentDate"
						value={formData.appointmentDate}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<label>Message:</label>
					<textarea
						name="message"
						value={formData.message}
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default Hair;

const handleSubmit = (e) => {
	e.preventDefault();

	emailjs
		.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_USER_ID")
		.then(
			(result) => {
				alert("Appointment request sent successfully!");
				setFormData({
					name: "",
					email: "",
					phone: "",
					appointmentDate: "",
					message: "",
				});
			},
			(error) => {
				alert("Failed to send appointment request.");
			}
		);
};
