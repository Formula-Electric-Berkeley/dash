function handleModal(id) {
    if (document.getElementById(id).style.display == "none" ||
        document.getElementById(id).style.display == "") {
        document.getElementById(id).style.display = "block"
    } else {
        document.getElementById(id).style.display = "none"
    }
}

window.onclick = function (event) {
    if (event.target == document.getElementById("storageUploadModalArea")) {
        document.getElementById("storageUploadModal").style.display = "none";
    }
}

function delete_document(id) {
    if (confirm("Are you sure you want to delete this data?\nThis action cannot be undone.")) {
        fetch('./delete_document/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(location.reload());
    }
}