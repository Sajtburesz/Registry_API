import unittest
from registry import app, registry, inverted

class RegistryAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        registry.clear()


    def test_add_item_and_check(self):
        response = self.app.post('/add', json={'item': 'red'})
        self.assertEqual(response.status_code, 204)
        response = self.app.get('/check/red')
        self.assertEqual(response.status_code, 200)
        self.assertIn('red is in the registry.', response.get_json()['message'])

    def test_add_invalid_item(self):
        response = self.app.post('/add', json={'item': 'red@123'})
        self.assertEqual(response.status_code, 422)
        self.assertIn('Item contains non alphanumeric characters or item is not a string.', response.get_json()['error'])

    def test_remove_item(self):
        self.app.post('/add', json={'item': 'blue'})
        response = self.app.delete('/remove/blue')
        self.assertEqual(response.status_code, 204)

    def test_check_invalid_item(self):
        response = self.app.get('/check/yellow@123')
        self.assertEqual(response.status_code, 422)
        self.assertIn('Item contains non alphanumeric characters or item is not a string.', response.get_json()['error'])

    def test_check_not_in_registry_item(self):
        self.app.post('/add', json={'item': 'red'})
        self.app.post('/invert')
        response = self.app.get('/check/blue')
        self.assertEqual(response.status_code, 400)
        self.assertIn('blue is not in the registry.', response.get_json()['error'])

    def test_check_in_registry_item_inverted(self):
        self.app.post('/add', json={'item': 'yellow'})
        self.app.post('/invert')
        response = self.app.get('/check/yellow')
        self.assertEqual(response.status_code, 400)
        self.assertIn('yellow is not in the registry.', response.get_json()['error'])

    def test_check_not_in_registry_item_inverted(self):
        r = self.app.post('/invert')
        response = self.app.get('/check/blue')
        self.assertEqual(response.status_code, 200)
        self.assertIn('blue is in the registry.', response.get_json()['message'])

    def test_diff(self):
        self.app.post('/add', json={'item': 'yellow'})
        response = self.app.post('/diff', json={'items': ['red', 'yellow', 'green']})
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.get_json()['diff'], ['red', 'green'])

if __name__ == '__main__':
    unittest.main()
