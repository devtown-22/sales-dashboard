import {Navbar} from "@/components/navbar";
import {Label} from "@/components/LabelValue";
import {Button, Container, Flex, Heading, Spinner, Alert} from "@chakra-ui/react";
import {useRef, useState} from "react";
import Swal from "sweetalert2";
import {createUsers} from "@/utils/api";

const parseCSV = (csv) => {
    const requiredHeaders = ['email', 'name', 'password'];
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    // check if the headers are correct
    if (headers.length !== requiredHeaders.length) {
        throw new Error('Invalid CSV number of headers');
    }
    // check if the headers are same
    for (let i = 0; i < headers.length; i++) {
        if (headers[i] !== requiredHeaders[i]) {
            throw new Error('Invalid CSV headers');
        }
    }


    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        if (obj.email && obj.name && obj.password) {
            // check if the email is valid with regex
            if (!obj.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
                throw new Error('Invalid email format - ' + obj.email);
            }

            if (obj.password.length < 6) {
                throw new Error('Invalid password length - ' + obj.password + ' for -> ' + obj.email + ', ' + obj.name);
            }

            result.push(obj);
        }
    }
    return result;
}



const Admin = () => {
    const inputRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);

    const handleAddUsers = async () => {
        setLoading(true);
        try {
            const res = await createUsers({
                users: users.filter(user => user.email && user.name && user.password)
            });
            setLoading(false);
            Swal.fire({

                title: 'Success',
                text: 'Users created successfully',
                icon: 'success'
            } );
        } catch (e) {
            setLoading(false);
            setError(e.response.data);
        }

    }

    const onChangeHandler = (e) => {
        setLoading(true);
        // read the file
        const file = e.target.files[0];
        // create a FileReader instance
        const reader = new FileReader();
        // read the file as text
        reader.readAsText(file);
        // when the file is loaded, prase the text to csv
        reader.onload = (event) => {
            // check the header of the csv file to make sure it is the right format (format: email,name,password)
            const csv = event.target.result;
            try {
                const parsedCSV = parseCSV(csv);
                setUsers(parsedCSV);
                setLoading(false);
            }
            catch (e) {
                setError(e.message);
                setLoading(false);
            }
        }

    }
    return (
        <div>
            <Navbar />
            <Container>
                <Heading fontSize={'2xl'} my={2}>
                    Add Users
                </Heading>
            <Label>
                Select a CSV File
            </Label>
                (The csv should have format => email, name, password)
                <input disabled={loading} type={'file'} onChange={onChangeHandler} />
                {loading && <Spinner/>}
                {users.length ?
                    <Flex flexDirection={'column'} my={5}>
                        The following users will be added
                    <textarea ref={inputRef} value={users.map(u => `${u.email},${u.name}`).join('\n')} disabled
                           rows={10}/>
                    </Flex>: ''}
                <Alert status={'error'} my={5}>{error}</Alert>
                {users.length ?<Button onClick={handleAddUsers} isLoading={loading} disabled={loading}>
                    Add Users
                </Button>: ''}
            </Container>
        </div>
    );

}

export default Admin;
