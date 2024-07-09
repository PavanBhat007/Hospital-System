// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    struct Patient {
        string name;
        uint256 age;
        string gender;
        string bloodGroup;
        string[] pastRecords;
        string[] appointments;
    }

    struct Doctor {
        string name;
        uint256 age;
        string gender;
        string specialty;
        string availability;
        string[] appointments;
    }

    mapping(address => Patient) private patients;
    mapping(address => Doctor) private doctors;

    function addPatient(address _patientAddress, string memory _name, uint256 _age, string memory _gender, string memory _bloodGroup) public {
        patients[_patientAddress] = Patient(_name, _age, _gender, _bloodGroup, new string[](0), new string[](0));
    }

    function getPatient(address _patientAddress) public view returns (string memory, uint256, string memory, string memory, string[] memory, string[] memory) {
        Patient memory p = patients[_patientAddress];
        return (p.name, p.age, p.gender, p.bloodGroup, p.pastRecords, p.appointments);
    }

    function addDoctor(address _doctorAddress, string memory _name, uint256 _age, string memory _gender, string memory _specialty, string memory _availability) public {
        doctors[_doctorAddress] = Doctor(_name, _age, _gender, _specialty, _availability, new string[](0));
    }

    function getDoctor(address _doctorAddress) public view returns (string memory, uint256, string memory, string memory, string memory, string[] memory) {
        Doctor memory d = doctors[_doctorAddress];
        return (d.name, d.age, d.gender, d.specialty, d.availability, d.appointments);
    }

    function addAppointment(address _patientAddress, address _doctorAddress, string memory _appointmentDetails) public {
        patients[_patientAddress].appointments.push(_appointmentDetails);
        doctors[_doctorAddress].appointments.push(_appointmentDetails);
    }

    function removeAppointment(address _patientAddress, address _doctorAddress, uint256 _index) public {
        // Remove appointment from patient's record
        for (uint256 i = _index; i < patients[_patientAddress].appointments.length - 1; i++) {
            patients[_patientAddress].appointments[i] = patients[_patientAddress].appointments[i + 1];
        }
        patients[_patientAddress].appointments.pop();

        // Remove appointment from doctor's record
        for (uint256 i = _index; i < doctors[_doctorAddress].appointments.length - 1; i++) {
            doctors[_doctorAddress].appointments[i] = doctors[_doctorAddress].appointments[i + 1];
        }
        doctors[_doctorAddress].appointments.pop();
    }
}
