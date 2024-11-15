import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ShowList() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadStudentList();
    }, []);

    const loadStudentList = async () => {
        try {
            const response = await fetch("https://672e1dd5229a881691ef09f0.mockapi.io/api/students/students");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    };

    const handleSaveStudent = async (studentData) => {
        try {
            const response = selectedStudent
                ? await fetch(`https://672e1dd5229a881691ef09f0.mockapi.io/api/students/students/${selectedStudent.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(studentData),
                })
                : await fetch("https://672e1dd5229a881691ef09f0.mockapi.io/api/students/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(studentData),
                });

            if (response.ok) {
                loadStudentList();
                setModalOpen(false);
                setSelectedStudent(null);
            } else {
                console.error("저장 실패:", response.status);
            }
        } catch (error) {
            console.error("저장 실패:", error);
        }
    };

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await fetch(`https://672e1dd5229a881691ef09f0.mockapi.io/api/students/students/${id}`, {
                method: "DELETE",
            });
            loadStudentList();
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    return (
        <div className="container text-center">
            <h1>학생 목록</h1>
            <button className="btn btn-primary my-3" onClick={() => setModalOpen(true)}>
                학생 추가
            </button>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>학생명</th>
                        <th>이메일 주소</th>
                        <th>학번</th>
                        <th>전화번호</th>
                        <th>수정 / 삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.studentId}</td>
                            <td>{student.phone}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(student)}>
                                    수정
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(student.id)}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalOpen && (
                <StudentModal
                    student={selectedStudent}
                    onSave={handleSaveStudent}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </div>
    );
}

function StudentModal({ student, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: student ? student.name : "",
        email: student ? student.email : "",
        studentId: student ? student.studentId : "",
        phone: student ? student.phone : "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{student ? "학생 수정" : "학생 추가"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>학생명</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>전화번호</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>이메일 주소</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>학번</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    className="form-control"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {student ? "수정 완료" : "추가"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowList;