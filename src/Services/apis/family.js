import _ from "lodash";
import apiService from "../apiService";

const BASE_PATH = "family";
const ITEM_PATH = `${BASE_PATH}/{id}`;

export function createFamilyMember(details) {
  return apiService.post(BASE_PATH, details);
}

export function deleteFamilyMember(id) {
  return apiService.delete(ITEM_PATH.replace("{id}", id));
}

export function getFamilyMembers(params) {
  return apiService.get(BASE_PATH, params);
}

export function editFamilyMember(profile) {
  return apiService.patch(ITEM_PATH.replace("{id}", profile.id), profile);
}

export function saveFamilyMember(profile) {
  return _.isNil(profile.id)
    ? createFamilyMember(_.omit(profile, "id"))
    : editFamilyMember(profile);
}
