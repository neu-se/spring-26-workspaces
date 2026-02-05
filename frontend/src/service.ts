import { z } from "zod";
import {
  zAddGradeResponse,
  zAddStudentResponse,
  zError,
  zGetTranscriptResponse,
  type AddGradeResponse,
  type AddStudentResponse,
  type GetTranscriptResponse,
} from "@cs4530-workspaces/shared";

export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Validate inputs and call the `addStudent` api
 *
 * @param password - credentials
 * @param studentName - a student name (error if empty)
 * @returns successful API response
 * @throws if validation fails or there is an API response error
 */
export async function addStudent(
  password: string,
  studentName: string,
): Promise<AddStudentResponse> {
  if (studentName === "") throw new ServiceError("Student name must be non-empty");

  const response = await fetch("/api/addStudent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      studentName,
    }),
  });
  const data = z.union([zError, zAddStudentResponse]).parse(await response.json());
  if ("error" in data) throw new ServiceError(data.error);
  return data;
}

/**
 * Validate inputs and call the `addGrade` api
 *
 * @param password - credentials
 * @param studentIDStr - student ID (error if not a positive integer)
 * @param courseName - student name
 * @param courseGradeStr - course grade (error if not a number between 0 and 100, inclusive)
 * @returns successful API response
 * @throws if validation fails or there is an API response error
 */
export async function addGrade(
  password: string,
  studentIDStr: string,
  courseName: string,
  courseGradeStr: string,
): Promise<AddGradeResponse> {
  const studentID = parseInt(studentIDStr);
  if (isNaN(studentID) || `${studentID}` !== studentIDStr || studentID < 0) {
    throw new ServiceError("Student ID is invalid");
  }

  const courseGrade = parseFloat(courseGradeStr);
  if (
    isNaN(courseGrade) ||
    `${courseGrade}` !== courseGradeStr ||
    courseGrade < 0 ||
    courseGrade > 100
  ) {
    throw new ServiceError("Course grade is not valid");
  }

  if (courseName === "") {
    throw new ServiceError("Course name is required");
  }

  const response = await fetch("/api/addGrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      studentID,
      courseName,
      courseGrade,
    }),
  });
  const data = z.union([zError, zAddGradeResponse]).parse(await response.json());
  if ("error" in data) throw new ServiceError(data.error);
  return data;
}

/**
 * Validate inputs and call the `getTranscript` API
 *
 * @param password - credentials
 * @param studentIDStr - student ID (error if not a positive integer)
 * @returns successful API response
 * @throws if validation fails or there is an API response error
 */
export async function getTranscript(
  password: string,
  studentIDStr: string,
): Promise<GetTranscriptResponse> {
  const studentID = parseInt(studentIDStr);
  if (isNaN(studentID) || `${studentID}` !== studentIDStr || studentID < 0) {
    throw new ServiceError("Student ID is invalid");
  }

  const response = await fetch("/api/getTranscript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      studentID,
    }),
  });
  const data = z.union([zError, zGetTranscriptResponse]).parse(await response.json());
  if ("error" in data) throw new ServiceError(data.error);
  return data;
}
